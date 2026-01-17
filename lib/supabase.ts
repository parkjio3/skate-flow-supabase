import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 URL과 Anon Key를 가져옵니다.
// NEXT_PUBLIC_ 접두사가 있어야 브라우저(클라이언트 측)에서 접근 가능합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수가 없을 경우 에러를 방지하기 위한 체크
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '에러: Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.'
  );
}

// Supabase 클라이언트를 생성하여 내보냅니다.
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
