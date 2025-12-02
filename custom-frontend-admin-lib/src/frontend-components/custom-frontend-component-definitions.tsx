import React from 'react';

import { ComponentRegistryService } from '@wildo-ai/saas-frontend-lib';
import { FrontendComponentType, CorePresetNames } from '@wildo-ai/presets-components-models';


// ===== CUSTOM VARIANT TYPE DEFINITIONS =====

// Custom Admin Button with enhanced admin features
export interface LowLevelComponentProps_Button_Preset_AdminButton {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  
  // Admin-specific features
  adminLevel?: 'standard' | 'elevated' | 'super';
  auditAction?: string;
  requireConfirmation?: boolean;
  adminTheme?: 'professional' | 'warning' | 'critical';
}

// Enhanced Admin Alert with audit trail
export interface LowLevelComponentProps_Alert_Preset_AdminAlert {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  
  // Admin alert features
  severity?: 'info' | 'warning' | 'error' | 'critical';
  showTimestamp?: boolean;
  auditId?: string;
  adminActions?: Array<{
    label: string;
    action: () => void;
    adminLevel?: 'standard' | 'elevated';
  }>;
}

// Admin-specific Menu Sidebar
export interface AppLayoutProps_MenuSidebar_Preset_AdminSidebar {
  children?: React.ReactNode;
  menuItems?: Array<{
    label: string;
    href: string;
    adminLevel?: 'standard' | 'elevated' | 'super';
    icon?: React.ReactNode;
  }>;
  
  // Admin sidebar features
  showUserRole?: boolean;
  showAuditPanel?: boolean;
  compactMode?: boolean;
  adminFeatures?: {
    systemHealth?: boolean;
    quickActions?: boolean;
    userImpersonation?: boolean;
  };
}

// ===== CUSTOM VARIANT TYPE MAP =====

// ===== CUSTOM COMPONENT IMPLEMENTATIONS =====

const AdminButton: React.FC<LowLevelComponentProps_Button_Preset_AdminButton> = ({ 
  children, 
  adminLevel = 'standard',
  auditAction,
  requireConfirmation,
  adminTheme = 'professional',
  onClick,
  ...props 
}) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (requireConfirmation) {
      const confirmed = window.confirm(`Confirm admin action: ${auditAction || 'Unknown action'}`);
      if (!confirmed) return;
    }
    
    // Log audit action if specified
    if (auditAction) {
      console.log(`[ADMIN AUDIT] ${auditAction} - Level: ${adminLevel}`);
    }
    
    onClick?.(event);
  }, [onClick, requireConfirmation, auditAction, adminLevel]);

  const getAdminStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    };

    const themeStyles = {
      professional: {
        backgroundColor: '#1f2937',
        color: 'white',
        border: '1px solid #374151'
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: 'white',
        border: '1px solid #d97706'
      },
      critical: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: '1px solid #b91c1c'
      }
    };

    const levelBorder = {
      standard: 'none',
      elevated: '2px solid #3b82f6',
      super: '2px solid #ef4444'
    };

    return {
      ...baseStyle,
      ...themeStyles[adminTheme],
      boxShadow: levelBorder[adminLevel] !== 'none' ? `0 0 0 ${levelBorder[adminLevel].split(' ')[0]} ${levelBorder[adminLevel].split(' ')[2]}` : 'none'
    };
  };

  return (
    <button {...props} style={getAdminStyles()} onClick={handleClick}>
      {adminLevel !== 'standard' && (
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          [{adminLevel.toUpperCase()}]
        </span>
      )}
      {children}
    </button>
  );
};

const AdminAlert: React.FC<LowLevelComponentProps_Alert_Preset_AdminAlert> = ({ 
  children, 
  severity = 'info',
  showTimestamp = true,
  auditId,
  adminActions,
  ...props 
}) => {
  const severityStyles = {
    info: { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #3b82f6' },
    warning: { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #ef4444' },
    critical: { backgroundColor: '#fecaca', color: '#991b1b', border: '2px solid #dc2626' }
  };

  const alertStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    ...severityStyles[severity]
  };

  return (
    <div {...props} style={alertStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <strong style={{ textTransform: 'uppercase', fontSize: '12px' }}>
              {severity}
            </strong>
            {showTimestamp && (
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {new Date().toLocaleTimeString()}
              </span>
            )}
            {auditId && (
              <span style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.8 }}>
                #{auditId}
              </span>
            )}
          </div>
          <div>{children}</div>
        </div>
        
        {adminActions && adminActions.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
            {adminActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid currentColor',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: action.adminLevel === 'elevated' ? 1 : 0.8
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminSidebar: React.FC<AppLayoutProps_MenuSidebar_Preset_AdminSidebar> = ({ 
  children, 
  menuItems,
  showUserRole = true,
  showAuditPanel = false,
  compactMode = false,
  adminFeatures
}) => {
  const sidebarStyle: React.CSSProperties = {
    padding: compactMode ? '12px' : '20px',
    backgroundColor: '#111827',
    color: 'white',
    border: '1px solid #374151',
    borderRadius: '8px',
    minHeight: '400px',
    width: compactMode ? '200px' : '280px'
  };

  return (
    <div style={sidebarStyle}>
      <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #374151' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
          Admin Panel
        </h3>
        {showUserRole && (
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            System Administrator
          </div>
        )}
      </div>

      {adminFeatures && (
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#1f2937', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Quick Actions</div>
          {adminFeatures.systemHealth && (
            <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '4px' }}>
              ✓ System Health: Good
            </div>
          )}
          {adminFeatures.quickActions && (
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              <button style={{ 
                padding: '2px 6px', 
                fontSize: '11px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px',
                marginRight: '4px'
              }}>
                Clear Cache
              </button>
            </div>
          )}
        </div>
      )}

      {menuItems && (
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                <a 
                  href={item.href}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    backgroundColor: item.adminLevel === 'super' ? '#dc2626' : 
                                   item.adminLevel === 'elevated' ? '#3b82f6' : 'transparent',
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.adminLevel && item.adminLevel !== 'standard' && (
                    <span style={{ 
                      fontSize: '10px', 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      padding: '1px 4px', 
                      borderRadius: '2px',
                      marginLeft: 'auto'
                    }}>
                      {item.adminLevel.toUpperCase()}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {showAuditPanel && (
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          backgroundColor: '#1f2937', 
          borderRadius: '6px',
          borderLeft: '3px solid #f59e0b'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
            Audit Trail
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            Last action: User login<br/>
            Time: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {children && (
        <div style={{ marginTop: '20px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ===== CUSTOM REGISTRY =====
export const RegistryCustomComponentsAdmin = () => {
  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_BUTTON,
    'AdminButton',
    AdminButton,
    { isConfigurable: false }
  );

  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_ALERT,
    'AdminAlert',
    AdminAlert,
    { isConfigurable: false }
  );

  ComponentRegistryService.register(
    FrontendComponentType.APPLICATION_LEVEL_MENUBAR,
    'AdminSidebar',
    AdminSidebar,
    { isConfigurable: false }
  );
};