"use client";
import { usePrismaStatus } from "../hooks/use-prisma-status";

export const PrismaStatus = ({ className }: any) => {
  const { status, isLoading, error } = usePrismaStatus();

  if (isLoading) {
    return (
      <span className={className} style={{ opacity: 0.5 }}>
        Loading...
      </span>
    );
  }

  if (error || !status) {
    return (
      <span className={className} style={{ opacity: 0.5 }}>
        Status unavailable
      </span>
    );
  }

  const isOperational = status.indicator === "none";

  return (
    <span
      className={className}
      style={{
        opacity: 1,
        color: isOperational ? "inherit" : "#f59e0b",
      }}
    >
      <i 
      {status.description}
    </span>
  );
};
