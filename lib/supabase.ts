import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 URL과 Anon Key를 가져옵니다.
// Vercel Settings -> Environment Variables에 반드시 등록되어 있어야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 빌드 시점에 환경 변수가 없어도 오류로 중단되지 않도록 체크 로직을 넣습니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase 환경 변수가 누락되었습니다. Vercel 설정에서 NEXT_PUBLIC_SUPABASE_URL와 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요."
  );
}

// 실제 클라이언트를 생성하여 export 합니다.
// 대체값(placeholder)을 넣어 빌드 에러를 방지합니다.
export const supabase = createClient(
  supabaseUrl || 'https://your-project-url.supabase.co',
  supabaseAnonKey || 'your-anon-key'
);
