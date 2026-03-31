const Activities = () => {
  const activities = [
    {
      title: "Founded",
      value: "2024",
    },
    {
      title: "Active Members",
      value: "50+",
    },
    {
      title: "Workshops and Events",
      value: "10+",
    },
    {
      title: "Students Reached",
      value: "350+",
    },
  ];
  return (
    <section className="w-full mx-auto max-w-7xl py-10 px-4 grid grid-cols-1 items-center md:grid-cols-2">
      <div className="w-full h-auto object-cover aspect-video md:aspect-square">
        <img
          alt="Img"
          className="w-full h-auto object-cover aspect-video md:aspect-square"
          src="/assets/images/gallery_7.jpg"
        />
      </div>
      <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg p-5">
        <h2 className="font-semibold leading-8 text-chart-1">
          Activities at Nanogram
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          What We Do
        </p>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Nanogram aim to develop tehnical skills and foster innovation
          Workshops & training, Competitions, Project develpoment, Networking,
          Community outreach & Social impact
        </p>
        <dl className="mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mt-16">
          {activities.map((activity) => (
            <div className="flex flex-col gap-y-3 border-l border-neutral pl-6">
              <dt className="text-sm leading-6 text-muted-foreground">
                <div>{activity.title}</div>
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight">
                <div>{activity.value}</div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Activities;
