import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orgCreateSchema } from "@open-doc/shared";

import { Check, X, PencilSimple } from "@phosphor-icons/react";

const OrganizationProfileCard = React.memo(({ organization, isAdmin, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(orgCreateSchema),
    defaultValues: {
      name: organization?.name || ""
    }
  });

  const onSubmit = async (data) => {
    await onUpdateName(data.name);
    setIsEditing(false);
  };

  const onCancel = () => {
    reset({ name: organization.name });
    setIsEditing(false);
  };

  return (
    <div className="bg-white mb-3 shadow-sm border border-border/50 p-8 flex flex-col items-center">

      {/* AVATAR */}
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-inner">
        {organization?.name?.[0]?.toUpperCase()}
      </div>

      {/* NAME SECTION */}
      {isEditing && isAdmin ? (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">

          <div className="flex items-center gap-2 border-b-2 border-primary py-1">

            <input
              {...register("name")}
              className="flex-1 bg-transparent outline-none text-lg font-medium text-center"
              autoFocus
            />

            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="text-primary hover:scale-110 transition-transform"
            >
              <Check size={20} weight="bold" />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="text-text-secondary"
            >
              <X size={20} weight="bold" />
            </button>

          </div>

          {errors.name && (
            <p className="text-red-500 text-[10px] text-center mt-1 font-bold uppercase">
              {errors.name.message}
            </p>
          )}

        </form>
      ) : (
        <div className="flex items-center gap-3">

          <h2 className="text-xl font-medium tracking-tight">
            {organization.name}
          </h2>

          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-text-secondary hover:text-primary"
            >
              <PencilSimple size={18} />
            </button>
          )}

        </div>
      )}

    </div>
  );
});

export default OrganizationProfileCard;