import useTheme from '../contexts/theme';

export default function ThemeBtn() {
    const { themeMode, lightTheme, darkTheme } = useTheme()

    const onChangeBtn = (e) => {
        const darkModeStatus = e.currentTarget.checked
        if (darkModeStatus) {
            darkTheme()
        } else {
            lightTheme()
        }
    }

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                onChange={onChangeBtn}
                checked={themeMode === "dark"}
            />
            <div className="w-11 h-6 bg-gray-200 ... peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">Toggle Theme</span>
        </label>
    )
}