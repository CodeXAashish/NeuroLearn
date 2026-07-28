const NotesSection = ({ icon, title, children }) => {
  return (
    <div className="mb-10 border-b border-slate-700 pb-8">

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>

        <h2 className="text-2xl font-bold text-cyan-400">
          {title}
        </h2>
      </div>

      <div className="text-lg leading-8 text-slate-300">
        {children}
      </div>

    </div>
  );
};

export default NotesSection;