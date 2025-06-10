import { Routes, Route, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'evaluation' | 'statistics'>('employees');

    const handleTabChange = (tab: 'employees' | 'departments' | 'evaluation' | 'statistics') => {
        setActiveTab(tab);
        navigate(`/${tab}`);
    };

    return (
        <MainLayout activeTab={activeTab} setActiveTab={handleTabChange}>
            <Routes>
                <Route path="/employees" element={<EmployeeManagement /* props */ />} />
                <Route path="/departments" element={<DepartmentManagement /* props */ />} />
                <Route path="/evaluation" element={<Evaluation />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/" element={<EmployeeManagement /* props */ />} />
            </Routes>
            {showAddEmployeeModal && <AddEditEmployeeModal /* props */ />}
        </MainLayout>
    );
};