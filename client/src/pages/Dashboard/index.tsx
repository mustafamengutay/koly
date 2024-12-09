import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatOverview from '../../components/Stats/StatOverview';
import ProjectContainer from '../../components/Project/ProjectContainer';

function Dashboard() {
  return (
    <DashboardLayout>
      <StatOverview />
      <ProjectContainer />
    </DashboardLayout>
  );
}

export default Dashboard;
