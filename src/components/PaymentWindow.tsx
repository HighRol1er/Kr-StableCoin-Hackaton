"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import WalletModal from "./WalletModal";

// KG 이니시스 스타일 결제 모달 (정적 데모)
// - TailwindCSS 기준
// - 체크박스 동의 + 결제수단 선택 시 "다 음" 버튼 활성화
// - props로 상품명/가격 전달 가능

export default function PaymentWindow({
  productName = "XXX",
  price = 1100,
  currency = "원",
}: {
  productName?: string;
  price?: number;
  currency?: string;
}) {
  const [agreeA, setAgreeA] = useState(false);
  const [agreeB, setAgreeB] = useState(false);
  const [method, setMethod] = useState<string | null>(null);
  const allAgreed = agreeA && agreeB;
  const canProceed = allAgreed && !!method;

  // 지갑 상태
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  const formattedPrice = useMemo(() => price.toLocaleString("ko-KR"), [price]);

  const generateWallet = () => {
    try {
      const privateKey = generatePrivateKey();
      const account = privateKeyToAccount(privateKey);

      setPrivateKey(privateKey);
      setWalletAddress(account.address);
      setShowWalletModal(true);
    } catch (error) {
      console.error("지갑 생성 중 오류:", error);
      alert("지갑 생성에 실패했습니다.");
    }
  };

  const methodsRow1 = [
    {
      key: "paystation",
      label: "PayStation",
      badge: "원화스테이블로 결제하기",
      tone: "paystation",
    },
    {
      key: "kakaopay",
      label: "pay",
      badge: "온 국민이 다 쓰는 카카오페이",
      tone: "kakao",
    },
    {
      key: "ssgpay",
      label: "SSGPAY.",
      badge: "처음 쓱하는 당신에게 3천원이 쓱-",
      tone: "ssg",
    },
  ];

  const methodGrid = [
    ["PAYCO", "L.pay", "KPAY", "samsungPay"],
    ["현대카드+", "삼성카드+", "비씨카드", "KB국민"],
    ["신한카드", "롯데카드", "NH농협", "하나카드"],
    ["씨티카드", "UnionPay", "그외카드"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        {/* 좌측 레드 리본 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-[#e74c3c]" />

        {/* 컨테이너 (두 컬럼) */}
        <div className="relative grid grid-cols-1 bg-white md:grid-cols-[1fr_320px]">
          {/* 좌측 컨텐츠 */}
          <div className="min-h-[640px] p-6 md:p-8">
            {/* 상단 바 */}
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xl font-semibold tracking-tight">
                <span className="rounded-md bg-blue-500 px-2 py-1 text-white">
                  PayStation
                </span>{" "}
                <span className="text-[#e74c3c]">Demo</span>
              </div>
              <p className="text-xs text-gray-500">
                안전하고 편리한 이니시스결제입니다.
              </p>
            </div>

            {/* 이용약관 */}
            <div className="rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 border-b px-4 py-3 text-sm">
                <label className="flex items-center gap-2 text-black">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={allAgreed}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setAgreeA(v);
                      setAgreeB(v);
                    }}
                  />
                  전체동의
                </label>
                <span className="ml-auto text-[11px] text-gray-500">
                  전자금융거래 이용약관
                </span>
                <label className="flex items-center gap-1 text-black">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={agreeA}
                    onChange={(e) => setAgreeA(e.target.checked)}
                  />
                  동의
                </label>
                <span className="text-[11px] text-gray-500">
                  개인정보의 수집 및 이용안내
                </span>
                <label className="flex items-center gap-1 text-black">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={agreeB}
                    onChange={(e) => setAgreeB(e.target.checked)}
                  />
                  동의
                </label>
                <button className="rounded-full bg-[#e74c3c] px-3 py-1 text-xs font-semibold text-white">
                  약관보기 ▾
                </button>
              </div>

              {/* 간편결제 라인 */}
              <div className="space-y-2 px-4 py-4">
                {methodsRow1.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition ${
                      method === m.key
                        ? "border-[#e74c3c] ring-2 ring-[#e74c3c]/20"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {m.key === "kakaopay" ? (
                        <div className="h-6 w-16">
                          <Image
                            src="/logo/kakaopay.png"
                            alt="Kakao Pay"
                            width={60}
                            height={20}
                            className="h-full w-object-contain"
                          />
                        </div>
                      ) : (
                        <span
                          className={`inline-block rounded-md px-2 py-1 text-xs font-bold ${
                            m.key === "paystation"
                              ? "bg-blue-500 text-white"
                              : m.tone === "kakao"
                              ? "bg-[#FEE500] text-black"
                              : "text-[#e74c3c]"
                          }`}
                        >
                          {m.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#e74c3c]">{m.badge}</span>
                  </button>
                ))}

                {/* 결제 수단 그리드 */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {methodGrid.flat().map((label, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMethod(label)}
                      className={`h-12 rounded-md border text-sm transition text-black ${
                        method === label
                          ? "border-[#e74c3c] ring-2 ring-[#e74c3c]/20"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 우측 요약 패널 */}
          <aside className="flex min-h-[640px] flex-col justify-between bg-[#e74c3c] p-6 text-white">
            <div>
              <div className="mb-6 flex items-center justify-between text-lg font-semibold">
                <span>KG 이니시스</span>
                <button
                  className="rounded-full p-1 text-white/80 hover:bg-white/10"
                  aria-label="close"
                >
                  ✕
                </button>
              </div>

              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <dt className="text-white/80">상품명</dt>
                  <dd className="font-medium">{productName}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <dt className="text-white/80">상품가격</dt>
                  <dd className="font-medium">
                    {formattedPrice} {currency}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <dt className="text-white/80">계좌기간</dt>
                  <dd className="font-medium">별도계약기간없음</dd>
                </div>
                <div className="flex items-center justify-between pt-2 text-base">
                  <dt className="font-semibold">결제금액</dt>
                  <dd className="font-bold">
                    {formattedPrice} {currency}
                  </dd>
                </div>
              </dl>
            </div>

            <button
              disabled={!canProceed}
              onClick={generateWallet}
              className={`mt-6 w-full rounded-xl bg-white px-6 py-4 text-lg font-semibold transition ${
                canProceed
                  ? "text-[#e74c3c] hover:opacity-90"
                  : "cursor-not-allowed opacity-50 text-[#e74c3c]"
              }`}
            >
              다 음
            </button>
          </aside>
        </div>
        {showWalletModal && (
          <WalletModal
            privateKey={privateKey}
            walletAddress={walletAddress}
            setShowWalletModal={setShowWalletModal}
          />
        )}
      </div>
    </div>
  );
}
