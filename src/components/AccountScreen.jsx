import React from "react";
import { FaUser, FaCalendarAlt, FaUtensils } from "react-icons/fa";
import ProfileCard from "./account/ProfileCard";
import ProfileEditForm from "./account/ProfileEditForm";
import CustomizationPanel from "./account/CustomizationPanel";
import AddMealModal from "./account/AddMealModal";
import PlannerModal from "./account/PlannerModal";
import HistoryTab from "./account/HistoryTab";
import PlannerTab from "./account/PlannerTab";

export default function AccountScreen(props) {
  const {
    t,
    theme,
    fontSize,
    registered,
    setShowRegisterForm,
    accountTab,
    setAccountTab,
    showRegisterForm,
    setIsEditingProfile,
    showAddMealModal,
    setShowAddMealModal,
    showPlannerModal,
    setShowPlannerModal
  } = props;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!registered ? (
        // Незарегистрированный пользователь
        <div className={`${theme.cardBg} p-6 rounded-xl shadow text-center`}>
          <FaUser className={`w-16 h-16 mx-auto ${theme.textSecondary} mb-4`} />
          <h2 className={`${fontSize.subheading} font-semibold mb-3`}>{t("Создайте свой профиль", "Create your profile")}</h2>
          <p className={`${theme.textSecondary} ${fontSize.body} mb-4`}>
            {t("Заполните данные, чтобы получать персонализированные рекомендации и управлять планом питания.", 
               "Fill in your details to get personalized recommendations and manage your meal plan.")}
          </p>
          <button
            onClick={() => setShowRegisterForm(true)}
            className={`px-6 py-3 rounded-xl ${fontSize.body} ${theme.accent} ${theme.accentHover} text-white`}
          >
            {t("Начать", "Get Started")}
          </button>
        </div>
      ) : (
        // Зарегистрированный пользователь
        <>
          <ProfileCard {...props} />

          {/* Табы: История / План меню */}
          <div className={`${theme.cardBg} p-3 rounded-xl shadow flex gap-2`}>
            <button
              onClick={() => setAccountTab("history")}
              className={`flex-1 px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "history" ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
              <FaCalendarAlt />
              {t("История питания", "Meal history")}
            </button>
            <button
              onClick={() => setAccountTab("planner")}
              className={`flex-1 px-4 py-2 rounded-xl ${fontSize.small} transition flex items-center justify-center gap-2 ${accountTab === "planner" ? `${theme.accent} text-white` : `${theme.border} border`}`}
            >
              <FaUtensils />
              {t("План меню", "Menu plan")}
            </button>
          </div>

          {accountTab === "history" && <HistoryTab {...props} />}
          {accountTab === "planner" && <PlannerTab {...props} />}

          <CustomizationPanel {...props} />
        </>
      )}

      {/* Модальные окна */}
      {showRegisterForm && (
        <ProfileEditForm
          {...props}
          onClose={() => {
            setShowRegisterForm(false);
            setIsEditingProfile(false);
          }}
        />
      )}

      {showAddMealModal && (
        <AddMealModal
          {...props}
          onClose={() => setShowAddMealModal(false)}
        />
      )}

      {showPlannerModal && (
        <PlannerModal
          {...props}
          onClose={() => setShowPlannerModal(false)}
        />
      )}
    </div>
  );
}
