export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
      <p className="text-gray-600 mt-3 text-sm md:text-base">
        Stay tuned! Notification features will be available here soon to help you manage your account and appointments more efficiently.
      </p>
      <div className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <span className="text-blue-700 font-semibold">
            We are working diligently to bring you timely updates and account alerts. 
          </span>
          <div className="text-gray-500 text-sm mt-2">
            In the meantime, you&#39;ll continue to receive important updates via email.
          </div>
        </div>
      </div>
    </div>
  );
}