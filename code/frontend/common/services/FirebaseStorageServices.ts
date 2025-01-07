import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { VM_ENVIRONMENT } from '@/common/constants';
import './firebase';

const storage = getStorage();

const FirebaseServices = {
  /** Uploads file to Firebase. Returns file Firebase URL. */
  uploadFile: async (file: string, fileName: string) => {
    try {
      const fileStoreRef = ref(
        storage,
        `uploaded/${VM_ENVIRONMENT}/${fileName}-${new Date().toISOString()}-${Math.round(
          Math.random() * 10 ** 10
        )}`
      );
      await uploadString(fileStoreRef, file, 'data_url');
      const url = await getDownloadURL(fileStoreRef);
      return { ok: true, data: url };
    } catch {
      return { ok: false, data: '' };
    }
  },
};

export default FirebaseServices;
