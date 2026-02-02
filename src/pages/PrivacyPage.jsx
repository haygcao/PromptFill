import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black tracking-tight mb-6">隐私政策</h1>
        <p className="text-sm text-gray-500 mb-8">最后更新：2026-02-01</p>

        <p className="leading-7 mb-6">
          本应用（“提示词填空器 / PromptFill”）非常重视用户隐私。我们承诺：不收集、不上传用户的个人信息，
          所有数据主要存储在本地设备或用户自己的 iCloud 中。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. 我们收集的信息</h2>
        <p className="leading-7 mb-4">
          我们不会收集任何可识别用户身份的信息，包括但不限于姓名、邮箱、电话号码、位置等。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. 数据存储与同步</h2>
        <ul className="list-disc pl-5 space-y-2 leading-7 mb-4">
          <li>本地存储：应用数据默认保存在设备本地。</li>
          <li>iCloud 同步（可选）：如用户开启 iCloud，同步数据仅存储在用户自己的 iCloud 容器中，用于设备间同步。</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">3. 网络访问</h2>
        <p className="leading-7 mb-4">
          应用可能在以下场景发起网络请求：生成分享短链接、获取官方模板更新、AI 功能调用（如有）。
          这些请求不会包含用户的个人身份信息。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">4. 第三方服务</h2>
        <p className="leading-7 mb-4">
          如用户使用分享、AI 等功能，相关请求会发送至我们的服务器或第三方服务提供商，仅用于完成对应功能。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">5. 数据删除</h2>
        <p className="leading-7 mb-4">
          用户可在应用内删除所有数据；卸载应用后，本地数据将被清除。若启用了 iCloud，同步数据需在 iCloud 中由用户自行管理。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. 政策更新</h2>
        <p className="leading-7 mb-4">
          我们可能会更新本隐私政策。若政策有重大变更，将在应用或官网公布。
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">7. 联系我们</h2>
        <p className="leading-7">
          如有隐私相关问题，请联系：tanshilongmario@hotmail.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
