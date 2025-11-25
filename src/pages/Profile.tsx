import { useState } from "react";
import styles from "./Profile.module.scss";
import {
  User,
  Edit2,
  Camera,
  Trophy,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export const Profile = () => {
  const [username, setUsername] = useState("SkyMaster99");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <span className={styles.avatarPlaceholder}>SM</span>
            <button className={styles.cameraBtn}>
              <Camera size={16} />
            </button>
          </div>
          <div className={styles.userInfo}>
            {isEditing ? (
              <div className={styles.editName}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
                <button onClick={() => setIsEditing(false)}>Save</button>
              </div>
            ) : (
              <h2 className={styles.username}>
                {username}
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editBtn}
                >
                  <Edit2 size={16} />
                </button>
              </h2>
            )}
            <p className={styles.email}>user@example.com</p>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.icon}>
            <Trophy size={24} color="#ffd700" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.label}>Total Wins</span>
            <span className={styles.value}>1,245</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.icon}>
            <TrendingUp size={24} color="#00e5ff" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.label}>Highest Multiplier</span>
            <span className={styles.value}>54.20x</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.icon}>
            <DollarSign size={24} color="#4caf50" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.label}>Total Profit</span>
            <span className={styles.value}>$12,450.00</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.icon}>
            <User size={24} color="#ff9800" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.label}>Member Since</span>
            <span className={styles.value}>Nov 2024</span>
          </div>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>Account Settings</h3>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h4>Email Notifications</h4>
            <p>Receive updates about bonuses and news</p>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h4>Sound Effects</h4>
            <p>Play sounds during game</p>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};
