
import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const usePermissions = () => {
  const { profile } = useAuth();

  const can = (action: string) => {
    if (!profile) return false;
    
    switch (profile.role) {
      case UserRole.ADMIN:
        return true; // Acceso total
        
      case UserRole.PROD_MANAGER:
        return [
          'view_orders', 
          'update_order_status', 
          'manage_inventory', 
          'view_production_reports',
          'manage_personnel'
        ].includes(action);
        
      case UserRole.FINANCIAL_ANALYST:
        return [
          'view_orders', 
          'view_financial_reports', 
          'view_costs'
        ].includes(action);
        
      case UserRole.WHOLESALE:
      case UserRole.RETAIL:
      case UserRole.EXPORT:
        return [
          'create_order', 
          'view_own_orders', 
          'view_catalog'
        ].includes(action);
        
      default:
        return false;
    }
  };

  return { can, role: profile?.role };
};
