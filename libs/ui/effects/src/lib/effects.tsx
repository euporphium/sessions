import styles from './effects.module.css';

/* eslint-disable-next-line */
export interface EffectsProps {}

export function Effects(props: EffectsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Effects!</h1>
    </div>
  );
}

export default Effects;
