export const TourStatus = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TourStatus = (typeof TourStatus)[keyof typeof TourStatus];
