import { useThemeContext } from "../context/ThemeContext";

export const TitleSkeleton = () => {
  const { darkMode } = useThemeContext();
  return (
    <>
      <div className="w-80 h-12 mx-auto m-2 py-5 px-5 bg-gray-200 dark:bg-gray-400 rounded-2xl animate-pulse"></div>
      <div className="w-120 h-6 mx-auto py-5 px-2 bg-gray-200 dark:bg-gray-400 rounded-2xl animate-pulse"></div>
    </>
  );
};
