import styles from '../styles/LoadingSpinner.module.scss';

export const LoadingSpinner = (): JSX.Element => {
  return (
    <div className={styles.spinner}>
      <svg viewBox="0 0 42 42" stroke="#00703c" width="75" height="75">
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(3 3)" stroke-width="5">
            <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              transform="rotate(112.708 18 18)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
