'use client';

import HelpCenter from '@/components/help/HelpCenter';
import styles from './help.module.css';

export default function HelpPage() {
  return (
    <div className={styles.helpPage}>
      <HelpCenter />
    </div>
  );
}