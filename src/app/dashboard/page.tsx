'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import UploadArea from '@/components/features/UploadArea';
import SummaryCard from '@/components/features/SummaryCard';
import ChatContainer from '@/components/features/ChatContainer';

import { WorkspaceProvider, useWorkspace } from '@/contexts/WorkspaceContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function DashboardInner() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const { isLoading: isWorkspaceLoading } = useWorkspace();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth || isWorkspaceLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <span className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full h-full">
        <Navbar />
        <MainLayout>
          <motion.div 
            className="flex flex-col gap-6 h-full p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <UploadArea />
            </motion.div>
            <div className="flex lg:flex-row flex-col gap-6 flex-1 min-h-0">
              <motion.div className="flex-1 flex flex-col overflow-hidden" variants={itemVariants}>
                <SummaryCard />
              </motion.div>
              <motion.div className="flex-[1.5] flex flex-col overflow-hidden" variants={itemVariants}>
                <ChatContainer />
              </motion.div>
            </div>
          </motion.div>
        </MainLayout>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <WorkspaceProvider>
      <DashboardInner />
    </WorkspaceProvider>
  );
}
