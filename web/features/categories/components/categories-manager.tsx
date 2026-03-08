"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { createCategoryAction, updateCategoryAction } from "@/features/categories/actions/categories.actions";
import {
  INITIAL_CATEGORIES_ACTION_STATE,
  type CategoriesActionState,
} from "@/features/categories/types/categories-action-state";
import type { CategoryDto } from "@/types/category";

function getFieldError(state: CategoriesActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

type CategoryRowFormProps = {
  category: CategoryDto;
};

function CategoryRowForm({ category }: CategoryRowFormProps) {
  const [state, action, isPending] = useActionState(updateCategoryAction, INITIAL_CATEGORIES_ACTION_STATE);

  return (
    <form action={action} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
      <input type="hidden" name="id" value={category.id} />
      <input
        name="name"
        defaultValue={category.name}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />
      <input
        name="slug"
        defaultValue={category.slug}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />
      <select
        name="type"
        defaultValue={category.type}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        <option value="income">income</option>
        <option value="expense">expense</option>
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Update"}
      </button>

      {state.message ? (
        <p className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
      ) : null}
      {getFieldError(state, "name") ? <p className="text-xs text-rose-600">{getFieldError(state, "name")}</p> : null}
      {getFieldError(state, "slug") ? <p className="text-xs text-rose-600">{getFieldError(state, "slug")}</p> : null}
    </form>
  );
}

type CategoriesManagerProps = {
  categories: CategoryDto[];
};

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [createState, createAction, createPending] = useActionState(
    createCategoryAction,
    INITIAL_CATEGORIES_ACTION_STATE,
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Create Category" />
        <form action={createAction} className="grid gap-3 sm:grid-cols-4">
          <input
            name="name"
            placeholder="Name"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="slug"
            placeholder="slug-example"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <select name="type" defaultValue="expense" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
          <button
            type="submit"
            disabled={createPending}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {createPending ? "Creating..." : "Create"}
          </button>
        </form>
        {createState.message ? (
          <p className={`mt-3 text-sm ${createState.success ? "text-emerald-700" : "text-rose-700"}`}>
            {createState.message}
          </p>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="Categories" />
        <div className="space-y-3">
          {categories.length === 0 ? <p className="text-sm text-slate-500">No categories yet.</p> : null}
          {categories.map((category) => (
            <CategoryRowForm key={category.id} category={category} />
          ))}
        </div>
      </Card>
    </div>
  );
}
