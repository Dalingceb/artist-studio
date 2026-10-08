
import { Link } from '@/lib/router-compat';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { Settings } from 'lucide-react';

const AdminDashboardLink = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link to="/admin">
      <Button variant="outline" size="sm" className="flex items-center">
        <Settings size={16} className="mr-2" />
        Admin
      </Button>
    </Link>
  );
};

export default AdminDashboardLink;
