import React, { useEffect, useState } from "react";

const indicatorStatus: any = {
  "-": "var(--color-foreground-neutral)",
  none: "var(--color-foreground-success)",
  major: "var(--color-foreground-error)",
  minor: "var(--color-foreground-warning)",
  critical: "var(--color-foreground-error)",
};
const PDPStatus = () => {
  const [pdpStatus, setPdpStatus] = useState({
    status: { indicator: "-", description: "Not Known" },
  });
  useEffect(() => {
    fetch("https://www.prisma-status.com/api/v2/status.json")
      .then((response) => response.json())
      .then((json) => {
        setPdpStatus(json);
      })
      .catch((error) =>
        console.log("PDP Status fetch failed " + error.message),
      );
  }, []);

  return (
    <a
      className="flex items-center justify-center decoration-none text-foreground-neutral text-base font-family-sans"
      href="https://www.prisma-status.com/"
    >
      <div
        className="w-3 h-3 rounded-full mr-2"
        style={{
          backgroundColor:
            indicatorStatus[
              pdpStatus.status.indicator ? pdpStatus.status.indicator : `-`
            ],
        }}
      />
      <span>
        <b>Platform Status:</b>
        <span className="underline ml-2 font-family-monospace">
          {pdpStatus.status.description}
        </span>
      </span>
    </a>
  );
};

export default PDPStatus;
