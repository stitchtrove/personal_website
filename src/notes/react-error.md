---
topics: ["React", "Problem solving", "frontend"]
publishedOn: 2024-03-17
title: No exported member in React
---


>I have this error all the time at work, I always forget how I solve it so here's the solution. 

When a component is being exported but you get the error “no exported member” you need to add the react props to the src/extras.d.ts file. 

const FilmShowing: (props: FilmShowingProps) => ReactElement;
