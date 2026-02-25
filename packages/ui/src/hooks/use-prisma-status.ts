import { useEffect, useState } from "react";

const PRISMA_STATUS_API_URL = "https://www.prisma-status.com/api/v2/summary.json";

type Component = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  position: number;
  description: string | null;
  showcase: boolean;
  start_date: string;
  group_id: string | null;
  page_id: string;
  group: boolean;
  only_show_if_degraded: boolean;
};

type Status = {
  indicator: string;
  description: string;
};

type PrismaStatus = {
  page: {
    id: string;
    name: string;
    url: string;
    time_zone: string;
    updated_at: string;
  };
  components: Component[];
  incidents: any[];
  scheduled_maintenances: any[];
  status: Status;
};

export const usePrismaStatus = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrismaStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(PRISMA_STATUS_API_URL);

        if (!response.ok) {
          throw new Error("Error fetching Prisma status data");
        }

        const data: PrismaStatus = await response.json();
        setStatus(data.status);
        setComponents(data.components);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrismaStatus();
  }, []);

  return { status, components, isLoading, error };
};
