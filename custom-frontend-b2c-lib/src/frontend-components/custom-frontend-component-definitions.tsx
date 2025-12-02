import React from 'react';

import { ComponentRegistryService } from '@wildo-ai/saas-frontend-lib';
import { FrontendComponentType, CorePresetNames } from '@wildo-ai/presets-components-models';

// ===== CUSTOM VARIANT TYPE DEFINITIONS =====

// Customer-focused Button with e-commerce features
export interface LowLevelComponentProps_Button_Preset_CustomerButton {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  
  // Customer/e-commerce features
  variant?: 'primary' | 'secondary' | 'purchase' | 'cart' | 'wishlist';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  fullWidth?: boolean;
  price?: number;
  currency?: string;
}

// Customer-friendly Alert for notifications and promotions
export interface LowLevelComponentProps_Alert_Preset_CustomerAlert {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  
  // Customer alert features
  type?: 'promotion' | 'notification' | 'warning' | 'success' | 'info';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  urgent?: boolean;
}

// Customer B2C Auth Layout
export interface PublicLayoutProps_CustomerB2CAuth_Preset_EnhancedAuth {
  children?: React.ReactNode;
  
  // Enhanced B2C auth features
  showLogo?: boolean;
  logoSrc?: string;
  backgroundImage?: string;
  brandColors?: {
    primary: string;
    secondary: string;
  };
  socialLogin?: {
    google?: boolean;
    facebook?: boolean;
    apple?: boolean;
  };
  showPromotion?: boolean;
  promotionText?: string;
}


// ===== CUSTOM COMPONENT IMPLEMENTATIONS =====

const CustomerButton: React.FC<LowLevelComponentProps_Button_Preset_CustomerButton> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  badge,
  fullWidth = false,
  price,
  currency = '$',
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
      medium: { padding: '10px 20px', fontSize: '14px' },
      large: { padding: '14px 28px', fontSize: '16px' }
    };

    const presets = {
      primary: { backgroundColor: '#2563eb', color: 'white', border: 'none' },
      secondary: { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' },
      purchase: { backgroundColor: '#059669', color: 'white', border: 'none' },
      cart: { backgroundColor: '#dc2626', color: 'white', border: 'none' },
      wishlist: { backgroundColor: '#ec4899', color: 'white', border: 'none' }
    };

    return {
      ...sizes[size],
      ...presets[variant],
      borderRadius: '8px',
      cursor: loading || disabled ? 'not-allowed' : 'pointer',
      opacity: loading || disabled ? 0.6 : 1,
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: '600',
      position: 'relative',
      width: fullWidth ? '100%' : 'auto',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
          Processing...
        </>
      );
    }

    return (
      <>
        {icon && <span>{icon}</span>}
        <span>
          {price !== undefined ? `${currency}${price.toFixed(2)} - ` : ''}
          {children}
        </span>
        {badge && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {badge}
          </span>
        )}
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

const CustomerAlert: React.FC<LowLevelComponentProps_Alert_Preset_CustomerAlert> = ({ 
  children, 
  type = 'info',
  title,
  dismissible = false,
  onDismiss,
  actionButton,
  icon,
  urgent = false,
  ...props 
}) => {
  const [visible, setVisible] = React.useState(true);

  const handleDismiss = React.useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  const typeConfig = {
    promotion: { 
      backgroundColor: '#fef3c7', 
      borderColor: '#f59e0b', 
      textColor: '#92400e',
      defaultIcon: '🎉'
    },
    notification: { 
      backgroundColor: '#dbeafe', 
      borderColor: '#3b82f6', 
      textColor: '#1e40af',
      defaultIcon: '🔔'
    },
    warning: { 
      backgroundColor: '#fee2e2', 
      borderColor: '#ef4444', 
      textColor: '#991b1b',
      defaultIcon: '⚠️'
    },
    success: { 
      backgroundColor: '#d1fae5', 
      borderColor: '#10b981', 
      textColor: '#065f46',
      defaultIcon: '✅'
    },
    info: { 
      backgroundColor: '#e0f2fe', 
      borderColor: '#0891b2', 
      textColor: '#164e63',
      defaultIcon: 'ℹ️'
    }
  };

  const config = typeConfig[type];
  
  const alertStyle: React.CSSProperties = {
    padding: '16px 20px',
    backgroundColor: config.backgroundColor,
    border: `1px solid ${config.borderColor}`,
    borderLeft: `4px solid ${config.borderColor}`,
    borderRadius: '8px',
    color: config.textColor,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    boxShadow: urgent ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
    animation: urgent ? 'pulse 2s infinite' : 'none'
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
      <div {...props} style={alertStyle}>
        <span style={{ 
          fontSize: '20px',
          marginTop: '2px'
        }}>
          {icon || config.defaultIcon}
        </span>
        
        <div style={{ flex: 1 }}>
          {title && (
            <div style={{ 
              fontWeight: '700', 
              marginBottom: '6px',
              fontSize: '16px'
            }}>
              {title}
              {urgent && <span style={{ color: '#ef4444', marginLeft: '8px' }}>URGENT</span>}
            </div>
          )}
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            {children}
          </div>
          
          {actionButton && (
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={actionButton.onClick}
                style={{
                  backgroundColor: config.borderColor,
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {actionButton.label}
              </button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
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
    </>
  );
};

const EnhancedAuth: React.FC<PublicLayoutProps_CustomerB2CAuth_Preset_EnhancedAuth> = ({ 
  children,
  showLogo = true,
  logoSrc,
  backgroundImage,
  brandColors = { primary: '#2563eb', secondary: '#f1f5f9' },
  socialLogin,
  showPromotion = false,
  promotionText
}) => {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1
  };

  const authCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    zIndex: 2,
    position: 'relative'
  };

  const logoStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle} />
      
      {showPromotion && promotionText && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: brandColors.primary,
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 3,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          🎉 {promotionText}
        </div>
      )}
      
      <div style={authCardStyle}>
        {showLogo && (
          <div style={logoStyle}>
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" style={{ maxHeight: '60px', maxWidth: '200px' }} />
            ) : (
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: brandColors.primary,
                marginBottom: '8px'
              }}>
                YourBrand
              </div>
            )}
          </div>
        )}
        
        {children}
        
        {socialLogin && (Object.values(socialLogin).some(Boolean)) && (
          <div style={{ marginTop: '24px' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
              color: '#6b7280',
              fontSize: '14px',
              position: 'relative'
            }}>
              <span style={{
                backgroundColor: 'white',
                padding: '0 12px',
                position: 'relative',
                zIndex: 1
              }}>
                or continue with
              </span>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: '#e5e7eb',
                zIndex: 0
              }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {socialLogin.google && (
                <button style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🔍 Google
                </button>
              )}
              {socialLogin.facebook && (
                <button style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📘 Facebook
                </button>
              )}
              {socialLogin.apple && (
                <button style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🍎 Apple
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== CUSTOM REGISTRY =====

export const RegistryCustomComponentsB2C = () => {
  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_BUTTON,
    'CustomerButton',
    CustomerButton,
    { isConfigurable: true }
  );
  
  
  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_ALERT,
    'CustomerAlert',
    CustomerAlert,
    { isConfigurable: true }
  );
  
  ComponentRegistryService.register(
    FrontendComponentType.PUBLIC_LAYOUTS_CUSTOMER_B2C_AUTH,
    'EnhancedAuth',
    EnhancedAuth,
    { isConfigurable: true }
  );
};
