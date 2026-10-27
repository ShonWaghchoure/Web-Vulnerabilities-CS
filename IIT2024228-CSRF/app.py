"""
CSRF demo — Cyber Security (IT-30001)
Variant: POST-based forged action (auto-submitting form)

Tiny Flask "bank". Logged-in user has a session cookie, can POST
/transfer to move money to another account.

CSRF_PROTECTION is a global flag, flipped live from the dashboard
(/toggle-protection), so the same /transfer code path can be shown
both vulnerable and mitigated without restarting the server.

"""

import secrets
from flask import (
    Flask, request, session, redirect, url_for, render_template, abort,
    flash, get_flashed_messages,
)

app = Flask(__name__)

app.secret_key = "dev-only-fixed-secret-do-not-use-in-prod-" + secrets.token_hex(4)

# Browsers now default unlabeled cookies to SameSite=Lax, which already
# blocks cross-site POSTs on its own. That's a real mitigation too, but
# it's not the one we're demoing — so we turn it off here to isolate
# CSRF_PROTECTION as the only variable. Secure=True is required to pair
# with SameSite=None; still works over plain http since 127.0.0.1 counts
# as a secure context.
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
)

# the switch for the whole demo — vulnerable vs mitigated
CSRF_PROTECTION = False

USERS = {
    "alice": {"password": "alice123", "balance": 1000},
    "bob":   {"password": "bob123",   "balance": 500},
}


def current_user():
    return session.get("user")


@app.route("/", methods=["GET"])
def home():
    if current_user():
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        u = request.form.get("username", "")
        p = request.form.get("password", "")
        if u in USERS and USERS[u]["password"] == p:
            session.clear()
            session["user"] = u
            session["csrf_token"] = secrets.token_hex(32)
            return redirect(url_for("dashboard"))
        error = "Invalid credentials."
    return render_template("login.html", error=error)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/toggle-protection", methods=["POST"])
def toggle_protection():
    global CSRF_PROTECTION
    if not current_user():
        abort(401)
    CSRF_PROTECTION = not CSRF_PROTECTION
    return redirect(url_for("dashboard"))


@app.route("/dashboard")
def dashboard():
    u = current_user()
    if not u:
        return redirect(url_for("login"))
    return render_template(
        "dashboard.html",
        username=u,
        balance=USERS[u]["balance"],
        other_users=[name for name in USERS if name != u],
        csrf_token=session.get("csrf_token", ""),
        csrf_protection=CSRF_PROTECTION,
    )


@app.route("/transfer", methods=["POST"])
def transfer():
    u = current_user()
    if not u:
        abort(401)

    # mitigation: synchronizer token check
    if CSRF_PROTECTION:
        submitted_token = request.form.get("csrf_token", "")
        real_token = session.get("csrf_token", "")
        if not submitted_token or not secrets.compare_digest(submitted_token, real_token):
            abort(403, description="CSRF token missing or invalid.")

    # the vulnerable part: nothing above this line proves the
    # request came from our own form, only that *some* cookie did
    to = request.form.get("to", "")
    try:
        amount = int(request.form.get("amount", "0"))
    except ValueError:
        amount = 0

    def fail(msg):
        flash(msg, "danger")
        return redirect(url_for("dashboard"))

    if to not in USERS or to == u or amount <= 0:
        return fail("Transfer failed: invalid recipient or amount.")
    if amount > USERS[u]["balance"]:
        return fail("Transfer failed: insufficient balance.")

    USERS[u]["balance"] -= amount
    USERS[to]["balance"] += amount

    # redirect (not render) so refreshing the page can't resubmit the transfer
    flash(f"Transferred {amount} to {to}.", "safe")
    return redirect(url_for("dashboard"))


if __name__ == "__main__":
    print("\nStarting in VULNERABLE mode — toggle from the dashboard.\n")
    app.run(debug=True, port=5000)