"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginRadar } from "@/app/apps/radar/actions";

const initialState = { error: "" as string | undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? "Checking…" : "Enter"}
    </button>
  );
}

export function RadarLoginForm({ csrf }: { csrf: string }) {
  const [state, formAction] = useFormState(loginRadar, initialState);

  return (
    <main className="lock-card">
      <div className="lock-marks">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src="/apps/radar/img/logo-no-name.png" alt="Radar" />
        <span className="rule" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cf" src="/apps/radar/img/counterforce-dark.png" alt="Counterforce" />
      </div>
      <div className="badge">Personal license only - Not for distribution</div>
      <h1>Radar access</h1>
      <p className="lede">
        Enter the access code you were given, then download the app and follow the
        setup steps.
      </p>
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <form action={formAction} autoComplete="off">
        <input type="hidden" name="csrf" value={csrf} />
        <label htmlFor="password">Access code</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          spellCheck={false}
        />
        <SubmitButton />
      </form>
      <p className="lock-foot">
        Please do not share this page or the installer without prior approval.
      </p>
    </main>
  );
}
