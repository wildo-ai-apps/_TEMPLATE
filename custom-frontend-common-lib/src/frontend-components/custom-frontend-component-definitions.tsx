import { ComponentRegistryService } from '@wildo-ai/saas-frontend-lib';
import { FrontendComponentType, CorePresetNames } from '@wildo-ai/presets-components-models';
import React from 'react';


// ===== CUSTOM VARIANT TYPE DEFINITIONS =====

// Utility Badge for common use cases
export interface LowLevelComponentProps_Badge_Preset_UtilityBadge {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  
  // Utility badge features
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  outline?: boolean;
  dot?: boolean;
  pulse?: boolean;
}



// ===== CUSTOM COMPONENT IMPLEMENTATIONS =====

const UtilityBadge: React.FC<LowLevelComponentProps_Badge_Preset_UtilityBadge> = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  outline = false,
  dot = false,
  pulse = false,
  ...props 
}) => {
  const presets = {
    default: { backgroundColor: '#6b7280', color: 'white', borderColor: '#6b7280' },
    success: { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' },
    warning: { backgroundColor: '#f59e0b', color: 'white', borderColor: '#f59e0b' },
    error: { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' },
    info: { backgroundColor: '#3b82f6', color: 'white', borderColor: '#3b82f6' },
    neutral: { backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }
  };

  const sizes = {
    small: { padding: '2px 6px', fontSize: '10px', minHeight: '16px' },
    medium: { padding: '4px 8px', fontSize: '12px', minHeight: '20px' },
    large: { padding: '6px 12px', fontSize: '14px', minHeight: '24px' }
  };

  const variantStyle = presets[variant];
  const sizeStyle = sizes[size];

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '12px',
    fontWeight: '600',
    border: outline ? `1px solid ${variantStyle.borderColor}` : 'none',
    backgroundColor: outline ? 'transparent' : variantStyle.backgroundColor,
    color: outline ? variantStyle.borderColor : variantStyle.color,
    animation: pulse ? 'pulse 2s infinite' : 'none',
    ...sizeStyle
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <span {...props} style={badgeStyle}>
        {dot && (
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: outline ? variantStyle.borderColor : 'currentColor',
            opacity: 0.8
          }} />
        )}
        {children}
      </span>
    </>
  );
};



// ===== CUSTOM REGISTRY =====

export const RegistryCustomComponentsCommon = () => {
  ComponentRegistryService.register(
    FrontendComponentType.LOW_LEVEL_BADGE,
    'UtilityBadge',
    UtilityBadge,
    { isConfigurable: true }
  );
};

