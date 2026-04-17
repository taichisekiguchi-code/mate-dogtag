// ============================================================
// mate Digital Dog Tag - App Core
// ルーティング・Firebase CRUD・写真アップロード・フォーム共通ロジック
// ============================================================

import { db, auth, storage, ENV } from './firebase-config.js';
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, query, where, getDocs
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import {
  ref, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';
import {
  signInAnonymously, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { DEMO_DOGS, getDemoProfile } from './demo-data.js';

// ============================================================
// デモモード判定
// ============================================================
const params = new URLSearchParams(window.location.search);
const isDemo = params.has('demo') || ENV.current === 'local';

// ============================================================
// Auth - 匿名認証で簡易ログイン
// ============================================================
let currentUser = null;

async function ensureAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        resolve(user);
      } else {
        try {
          const result = await signInAnonymously(auth);
          currentUser = result.user;
          resolve(result.user);
        } catch (e) {
          console.warn('⚠️ Auth unavailable (demo mode):', e.message);
          currentUser = { uid: 'demo-user-001' };
          resolve(currentUser);
        }
      }
    });
  });
}

// ============================================================
// Firestore CRUD
// ============================================================

// タグIDから犬プロフィールを取得
async function getDogByTagId(tagId) {
  if (isDemo) {
    // デモモード: ローカルデータから取得
    const demoKey = params.get('demo') || 'mydog';
    return getDemoProfile(demoKey);
  }
  try {
    const docRef = doc(db, 'dogs', tagId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (e) {
    console.error('❌ Firestore read error:', e);
    return null;
  }
}

// 犬プロフィールを新規作成
async function createDogProfile(tagId, data) {
  if (isDemo) {
    console.log('🎭 デモモード: 登録をシミュレーション', data);
    // デモ用にlocalStorageの代わりにメモリに保存
    DEMO_DOGS[tagId] = { id: tagId, ...data, isOwner: true, isLostMode: false };
    return { success: true, id: tagId };
  }
  try {
    const user = await ensureAuth();
    const dogData = {
      ...data,
      ownerId: user.uid,
      isLostMode: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, 'dogs', tagId), dogData);

    // オーナー情報も保存
    if (data.owner) {
      await setDoc(doc(db, 'users', user.uid), {
        ...data.owner,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    return { success: true, id: tagId };
  } catch (e) {
    console.error('❌ Firestore write error:', e);
    return { success: false, error: e.message };
  }
}

// 犬プロフィールを更新
async function updateDogProfile(tagId, data) {
  if (isDemo) {
    console.log('🎭 デモモード: 更新をシミュレーション', data);
    const existing = DEMO_DOGS[params.get('demo') || 'mydog'] || {};
    Object.assign(existing, data);
    return { success: true };
  }
  try {
    const dogData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(doc(db, 'dogs', tagId), dogData);

    if (data.owner) {
      const user = await ensureAuth();
      await setDoc(doc(db, 'users', user.uid), {
        ...data.owner,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    return { success: true };
  } catch (e) {
    console.error('❌ Firestore update error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================
// Storage - 写真アップロード
// ============================================================

async function uploadDogPhoto(tagId, file) {
  if (isDemo) {
    // デモモード: FileReaderでローカルプレビュー生成
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('🎭 デモモード: 写真アップロードをシミュレーション');
        resolve({ success: true, url: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  }
  try {
    const fileExt = file.name.split('.').pop();
    const storageRef = ref(storage, `dogs/${tagId}/photo.${fileExt}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (e) {
    console.error('❌ Storage upload error:', e);
    return { success: false, error: e.message };
  }
}

// ============================================================
// フォームユーティリティ
// ============================================================

// フォームデータを構造化オブジェクトに変換
function collectFormData(form) {
  const fd = new FormData(form);
  return {
    name: fd.get('dogName') || '',
    breed: fd.get('breed') || '',
    birthday: fd.get('birthday') || '',
    age: calcAge(fd.get('birthday')),
    weight: fd.get('weight') ? fd.get('weight') + 'kg' : '',
    gender: fd.get('gender') || '',
    color: fd.get('color') || '',
    personality: fd.get('personality') || '',
    favorites: (fd.get('favorites') || '').split(/[,、\s]+/).filter(Boolean),
    medical: {
      vaccination: fd.get('vaccination') || '',
      allergies: fd.get('allergies') || '',
      microchip: fd.get('microchip') || '',
      vet: fd.get('vet') || ''
    },
    owner: {
      name: fd.get('ownerName') || '',
      phone: fd.get('phone') || '',
      email: fd.get('email') || '',
      address: fd.get('address') || ''
    },
    socialLinks: {
      instagram: fd.get('instagram') || ''
    }
  };
}

// 誕生日から年齢を計算
function calcAge(birthday) {
  if (!birthday) return '';
  const birth = new Date(birthday);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years--;
  }
  return years + '歳';
}

// フォームに既存データを流し込む
function populateForm(form, dog) {
  if (!dog) return;
  const setVal = (name, val) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el && val) el.value = val;
  };
  setVal('dogName', dog.name);
  setVal('breed', dog.breed === '未登録' ? '' : dog.breed);
  setVal('birthday', dog.birthday);
  setVal('weight', dog.weight ? dog.weight.replace('kg', '') : '');
  setVal('gender', dog.gender);
  setVal('color', dog.color);
  setVal('personality', dog.personality);
  setVal('favorites', dog.favorites ? dog.favorites.join('、') : '');
  // Medical
  if (dog.medical) {
    setVal('vaccination', dog.medical.vaccination);
    setVal('allergies', dog.medical.allergies === 'なし' ? '' : dog.medical.allergies);
    setVal('microchip', dog.medical.microchip);
    setVal('vet', dog.medical.vet);
  }
  // Owner
  if (dog.owner) {
    setVal('ownerName', dog.owner.name === '未設定' ? '' : dog.owner.name);
    setVal('phone', dog.owner.phone);
    setVal('email', dog.owner.email);
    setVal('address', dog.owner.address);
  }
  // Social
  if (dog.socialLinks) {
    setVal('instagram', dog.socialLinks.instagram);
  }
}

// バリデーション
function validateStep(stepEl) {
  const required = stepEl.querySelectorAll('[required]');
  let valid = true;
  required.forEach(input => {
    const errorEl = input.parentElement.querySelector('.field-error');
    if (!input.value.trim()) {
      input.classList.add('input-error');
      if (errorEl) errorEl.textContent = 'この項目は必須です';
      valid = false;
    } else {
      input.classList.remove('input-error');
      if (errorEl) errorEl.textContent = '';
    }
  });
  return valid;
}

// トースト通知
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// Exports
// ============================================================

export {
  ensureAuth,
  currentUser,
  getDogByTagId,
  createDogProfile,
  updateDogProfile,
  uploadDogPhoto,
  collectFormData,
  calcAge,
  populateForm,
  validateStep,
  showToast,
  isDemo,
  params
};
