import { useState } from "react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

interface WalletModalProps {
  privateKey: string;
  walletAddress: string;
  setShowWalletModal: (show: boolean) => void;
}

export default function WalletModal({
  privateKey,
  walletAddress,
  setShowWalletModal,
}: WalletModalProps) {
  return (
    // {showWalletModal && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">지갑 생성 완료</h2>
          <button
            onClick={() => setShowWalletModal(false)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지갑 주소 (Sepolia)
            </label>
            <div className="relative">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono"
              />
              <button
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600"
              >
                복사
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              개인키 (⚠️ 안전하게 보관하세요)
            </label>
            <div className="relative">
              <input
                type="password"
                value={privateKey}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono"
              />
              <button
                onClick={() => navigator.clipboard.writeText(privateKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600"
              >
                복사
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 p-3">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ 주의사항:</strong>
              <br />
              • 개인키는 절대 타인에게 공유하지 마세요
              <br />
              • 안전한 곳에 백업해두세요
              <br />• Sepolia 테스트넷에서만 사용하세요
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowWalletModal(false)}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              닫기
            </button>
            <button
              onClick={() => {
                // Sepolia Faucet으로 이동
                window.open("https://sepoliafaucet.com/", "_blank");
              }}
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              테스트 ETH 받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
