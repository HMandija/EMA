const Gallery = () => {
  return (
    <section className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="group cursor-pointer overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition duration-500 transform hover:scale-105"
          />
          <div className="mt-4">
            <h3 className="text-sm uppercase tracking-widest">
              {project.title}
            </h3>
            <p className="text-xs text-gray-500">{project.location}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
