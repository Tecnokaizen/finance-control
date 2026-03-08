export function getUserFacingErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }

  if (error.message === "UNAUTHORIZED") {
    return "Authentication required.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("duplicate key value")) {
    if (message.includes("business_id, slug")) {
      return "A category with this slug already exists in the current business.";
    }

    if (message.includes("invoice_number")) {
      return "Invoice number already exists for this type in the current business.";
    }

    return "A record with the same unique values already exists.";
  }

  if (message.includes("violates foreign key constraint")) {
    if (message.includes("category_id")) {
      return "Selected category is invalid for the current business.";
    }

    if (message.includes("third_party_id")) {
      return "Selected third party is invalid for the current business.";
    }

    if (message.includes("document_id")) {
      return "Selected document is invalid for the current business.";
    }

    if (message.includes("import_id")) {
      return "Selected import is invalid for the current business.";
    }

    return "A related record is missing or not accessible for the current business.";
  }

  if (message.includes("violates row-level security policy")) {
    return "You do not have permission to access this business resource.";
  }

  if (message.includes("invalid input syntax for type uuid")) {
    return "One or more identifiers are invalid.";
  }

  if (message.includes("could not find the table")) {
    return "Database schema is not ready. Apply pending migrations.";
  }

  return fallback;
}
