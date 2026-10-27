migrate(
  (app) => {
    // Remove irregular fictional cases that violate compliance and brand manual
    try {
      app
        .db()
        .newQuery(
          `DELETE FROM success_cases WHERE savings IS NOT NULL OR title LIKE '%Súmula X%' OR title LIKE '%Redução%'`,
        )
        .execute()
    } catch (_) {}
  },
  (app) => {
    // Reversible no-op
  },
)
