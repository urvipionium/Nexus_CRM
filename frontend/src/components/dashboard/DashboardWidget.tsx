import SalesChart from "./SalesChart";
import PipelineSummary from "./PipelineSummary";
import RecentDeals from "./RecentDeals";
import ActivityPanel from "./ActivityPanel";

type Props = {
  type: string;
};

export default function DashboardWidget({ type }: Props) {

  switch (type) {

    case "SalesChart":
      return <SalesChart />;

    case "PipelineSummary":
      return <PipelineSummary />;

    case "RecentDeals":
      return <RecentDeals />;

    case "ActivityPanel":
      return <ActivityPanel />;

    default:
      return null;
  }
}