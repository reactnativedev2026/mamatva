import { TFunction } from 'i18next';

export const getDashboardFallbackContent = (t: TFunction) => ({
  tips: [
    {
      title: t('dashboard.todayTips'),
      description: t('dashboard.todayTipDescription'),
    },
    {
      title: t('dashboard.yesterdayTips'),
      description: t('dashboard.yesterdayTipDescription'),
    },
  ],
  courses: [
    { title: t('dashboard.courseYoga'), price: '$ 599', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400' },
    { title: t('dashboard.courseNutrition'), price: '$ 499', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400' },
    { title: t('dashboard.courseBreathwork'), price: '$ 299', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400' },
    { title: t('dashboard.courseBirthPrep'), price: '$ 799', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400' },
  ],
  tools: [
    { title: t('dashboard.toolSymptoms'), img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=400' },
    { title: t('dashboard.toolDietChart'), img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400' },
    { title: t('dashboard.toolDadiNani'), img: 'https://images.unsplash.com/photo-1540348563548-617637877232?q=80&w=400' },
    { title: t('dashboard.toolSexSutra'), img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400' },
    { title: t('dashboard.toolUploadReports'), img: 'https://images.unsplash.com/photo-1618060932014-4eb2c9fc1696?q=80&w=400' },
    { title: t('dashboard.toolAppointment'), img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=400' },
    { title: t('dashboard.toolKickCounter'), img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=400' },
    { title: t('dashboard.toolWeightTracker'), img: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=400' },
    { title: t('dashboard.toolVaccination'), img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400' },
  ],
  experts: [
    { name: t('dashboard.expertAstrologers'), img: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=400' },
    { name: t('dashboard.expertFinancial'), img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400' },
    { name: t('dashboard.expertDoctor'), img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400' },
    { name: t('dashboard.expertStemCell'), img: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?q=80&w=400' },
    { name: t('dashboard.expertLactationist'), img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=400' },
    { name: t('dashboard.expertNutritionist'), img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400' },
  ],
  expertAdvice: [
    { title: 'Healthy Eating', date: 'MAR 2026', author: 'Dr. Sarah', img: 'https://images.unsplash.com/photo-1584820921424-706596396e95?q=80&w=600' },
    { title: 'Safe Exercise', date: 'MAR 2026', author: 'Coach Jen', img: 'https://images.unsplash.com/photo-1518611012118-2969c6370238?q=80&w=600' },
    { title: 'Mental Wellness', date: 'MAR 2026', author: 'Dr. Miller', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600' },
  ],
  communityPosts: [
    {
      title: t('dashboard.communityWelcomeTitle'),
      content: t('dashboard.communityWelcomeContent'),
      mediaType: 'text',
    },
  ],
});
