"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginBibliography } from "@/app/apps/bibliography/actions";

const initialState = { error: "" as string | undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring mt-6 inline-flex bg-[var(--color-cobalt)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)] disabled:opacity-60"
    >
      {pending ? "Checking…" : "Enter"}
    </button>
  );
}

export function BibliographyLoginForm({ csrf }: { csrf: string }) {
  const [state, formAction] = useFormState(loginBibliography, initialState);

  return (
    <div className="mx-auto max-w-lg border-2 border-[var(--color-ink)] bg-white p-6 md:p-8">
      <p className="meta-label text-[var(--color-cobalt)]">Invite only</p>
      <h1 className="mt-3 font-display text-3xl tracking-tight text-[var(--color-ink)] md:text-4xl">
        Bibliography access
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
        Enter the access code you were given. The library lives at
        library.drjforrest.com and is not open to the public.
      </p>
      {state?.error ? (
        <p className="mt-4 text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      <form action={formAction} autoComplete="off" className="mt-6">
        <input type="hidden" name="csrf" value={csrf} />
        <label
          htmlFor="bibliography-code"
          className="meta-label text-[var(--color-ink)]"
        >
          Access code
        </label>
        <input
          id="bibliography-code"
          name="code"
          type="password"
          required
          autoFocus
          spellCheck={false}
          className="mt-2 w-full border-2 border-[var(--color-ink)] bg-[var(--color-chalk)] px-3 py-3 text-base text-[var(--color-ink)] outline-none focus:border-[var(--color-cobalt)]"
        />
        <SubmitButton />
      </form>
    </div>
  );
}
