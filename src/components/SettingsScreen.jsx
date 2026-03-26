import React from 'react';
import { useApp } from '../context/AppContext';
import CustomizationPanel from './account/CustomizationPanel';
import AdvancedSettingsPanel from './account/AdvancedSettingsPanel';

export default function SettingsScreen(props) {
  const { t, theme, fontSize } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className={`${theme.cardBg} p-5 rounded-2xl shadow flex items-center gap-3`}>
        <span className="text-2xl">⚙️</span>
        <div>
          <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
            {t('Настройки', 'Settings')}
          </h2>
          <p className={`${fontSize.small} ${theme.textSecondary}`}>
            {t('Тема, шрифт, язык и расширенные параметры', 'Theme, font, language and advanced options')}
          </p>
        </div>
      </div>

      <CustomizationPanel {...props} />
      <AdvancedSettingsPanel />
    </div>
  );
}
