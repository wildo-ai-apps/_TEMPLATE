import React from 'react';
import { ComponentRegistryService } from '@wildo-ai/saas-frontend-lib';
import { FrontendComponentType, CorePresetNames } from '@wildo-ai/presets-components-models';


// ===== CUSTOM VARIANT TYPE DEFINITIONS =====

// Custom User-Friendly Button with enhanced UX
export interface LowLevelComponentProps_Button_Preset_UserButton {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  
  // User experience features
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
  shadow?: boolean;
}

// Enhanced User Alert with better UX
export interface LowLevelComponentProps_Alert_Preset_UserAlert {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  
  // User-friendly alert features
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
  compact?: boolean;
}

// User-friendly Main Container
export interface AppLayoutProps_MainContainer_Preset_UserContainer {
  children?: React.ReactNode;
  
  // User container features
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large';
  centered?: boolean;
  background?: 'default' | 'subtle' | 'card' | 'transparent';
  showHeader?: boolean;
  headerTitle?: string;
  headerActions?: React.ReactNode;
}

// ===== CUSTOM COMPONENT IMPLEMENTATIONS =====

const UserButton: React.FC<LowLevelComponentProps_Button_Preset_UserButton> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  rounded = false,
  shadow = false,
  onClick,
  disabled,
  ...props 
}) => {
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    onClick?.(event);
  }, [onClick, loading, disabled]);

  const getButtonStyles = (): React.CSSProperties => {
    const sizes = {
      small: { padding: '6px 12px', fontSize: '12px' },
      medium: { padding: '8px 16px', fontSize: '14px' },
      large: { padding: '12px 24px', fontSize: '16px' }
    };

    const presets = {
      primary: { backgroundColor: '#3b82f6', color: 'white', border: '1px solid #3b82f6' },
      secondary: { backgroundColor: '#6b7280', color: 'white', border: '1px solid #6b7280' },
      success: { backgroundColor: '#10b981', color: 'white', border: '1px solid #10b981' },
      warning: { backgroundColor: '#f59e0b', color: 'white', border: '1px solid #f59e0b' },
      danger: { backgroundColor: '#ef4444', color: 'white', border: '1px solid #ef4444' }
    };

    return {
      ...sizes[size],
      ...presets[variant],
      borderRadius: rounded ? '24px' : '6px',
      cursor: loading || disabled ? 'not-allowed' : 'pointer',
      opacity: loading || disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500',
      border: 'none',
      boxShadow: shadow && !disabled && !loading ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
      transform: 'scale(1)'
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span style={{ 
            width: '16px', 
            height: '16px', 
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading...
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </>
    );
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <button 
        {...props} 
        style={getButtonStyles()} 
        onClick={handleClick}
        disabled={disabled || loading}
      >
        {renderContent()}
      </button>
    </>
  );
};

const UserAlert: React.FC<LowLevelComponentProps_Alert_Preset_UserAlert> = ({ 
  children, 
  type = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon,
  showIcon = true,
  compact = false,
  ...props 
}) => {
  const [visible, setVisible] = React.useState(true);

  const handleDismiss = React.useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  const typeConfig = {
    success: { 
      backgroundColor: '#d1fae5', 
      borderColor: '#10b981', 
      textColor: '#065f46',
      defaultIcon: '✓'
    },
    info: { 
      backgroundColor: '#dbeafe', 
      borderColor: '#3b82f6', 
      textColor: '#1e40af',
      defaultIcon: 'ℹ'
    },
    warning: { 
      backgroundColor: '#fef3c7', 
      borderColor: '#f59e0b', 
      textColor: '#92400e',
      defaultIcon: '⚠'
    },
    error: { 
      backgroundColor: '#fee2e2', 
      borderColor: '#ef4444', 
      textColor: '#991b1b',
      defaultIcon: '✕'
    }
  };

  const config = typeConfig[type];
  
  const alertStyle: React.CSSProperties = {
    padding: compact ? '8px 12px' : '12px 16px',
    backgroundColor: config.backgroundColor,
    border: `1px solid ${config.borderColor}`,
    borderLeft: `4px solid ${config.borderColor}`,
    borderRadius: '6px',
    color: config.textColor,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px'
  };

  return (
    <div {...props} style={alertStyle}>
      {showIcon && (
        <span style={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginTop: compact ? '0px' : '2px'
        }}>
          {icon || config.defaultIcon}
        </span>
      )}
      
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ 
            fontWeight: '600', 
            marginBottom: '4px',
            fontSize: compact ? '14px' : '16px'
          }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: compact ? '13px' : '14px' }}>
          {children}
        </div>
      </div>
      
      {dismissible && (
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: config.textColor,
            opacity: 0.7,
            padding: '0px 4px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

const UserContainer: React.FC<AppLayoutProps_MainContainer_Preset_UserContainer> = ({ 
  children,
  maxWidth = 'lg',
  padding = 'medium',
  centered = true,
  background = 'default',
  showHeader = false,
  headerTitle,
  headerActions
}) => {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%'
  };

  const paddings = {
    none: '0px',
    small: '12px',
    medium: '20px',
    large: '32px'
  };

  const backgrounds = {
    default: '#ffffff',
    subtle: '#f9fafb',
    card: '#ffffff',
    transparent: 'transparent'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: maxWidths[maxWidth],
    margin: centered ? '0 auto' : '0',
    padding: paddings[padding],
    backgroundColor: backgrounds[background],
    borderRadius: background === 'card' ? '8px' : '0',
    boxShadow: background === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    minHeight: '200px'
  };

  return (
    <div style={containerStyle}>
      {showHeader && (
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {headerTitle && (
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827'
            }}>
              {headerTitle}
            </h1>
          )}
          {headerActions && (
            <div>{headerActions}</div>
          )}
        </header>
      )}
      {children}
    </div>
  );
};

// ===== CUSTOM REGISTRY =====

export const RegistryCustomComponentsMain = () => {

  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_BUTTON,
    'UserButton',
    UserButton,
    { isConfigurable: true }
  );

  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_ALERT,
    'UserAlert',
    UserAlert,
    { isConfigurable: true }
  );

  ComponentRegistryService.register(
    FrontendComponentType.APP_LAYOUTS_MAIN_CONTAINER,
    'UserContainer',
    UserContainer,
    { isConfigurable: true }
  );
};