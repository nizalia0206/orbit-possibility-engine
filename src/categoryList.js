import { CAREERS } from './data';

// The 8 broad career categories used for Careers filters and the
// "What kind of futures interest you?" build step.
const NAMES = ['Environment', 'Technology', 'Healthcare', 'Engineering', 'Business', 'Design', 'Science', 'Social Sciences'];

export const CATEGORY_LIST = NAMES.map(name => {
  const match = CAREERS.find(c => c.category === name);
  return {
    key: name,
    label: (lang) => (lang === 'ar' ? (match?.categoryAr || name) : name),
  };
});
