import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import UploadArea from '@/components/features/UploadArea';
import SummaryCard from '@/components/features/SummaryCard';
import ChatContainer from '@/components/features/ChatContainer';

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full h-full">
        <Navbar />
        <MainLayout>
          <div className="flex flex-col gap-6 h-full p-6">
            <UploadArea />
            <div className="flex lg:flex-row flex-col gap-6 flex-1 min-h-0">
              <div className="flex-1 flex flex-col overflow-hidden">
                <SummaryCard />
              </div>
              <div className="flex-[1.5] flex flex-col overflow-hidden">
                <ChatContainer />
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
