# NYC PROJECT 🌆 - Hugo Lhernould

Welcome in my interactive map and statistics project based on Leaflet, Recharts and React! This application displays markers representing arrests and bike locations on a map. It includes a WebSocket connection for real-time updates and uses a backend to retrieve data.

### Data used 🔥

- NYC OpenedData (criminality): [link](https://opendata.cityofnewyork.us/)
- Stations bike of NYC: [link](https://gbfs.lyft.com/gbfs/1.1/bkn/en/station_information.json)

### Technos used 🔮
- [Next.js](https://nextjs.org/) 15.1
- [Recharts](https://recharts.org/en-US/)
- [Leaflet](https://react-leaflet.js.org/)
- [MapBox](https://www.mapbox.com/)
- [Notistack](https://notistack.com/)
- [Socket.io](https://socket.io/)
- [Docker](https://www.docker.com/)
- [PostGreSQL](https://www.postgresql.org/)

### Installation 🧑‍💻

1. **Clone repo**

2. **For Backend:**
    - Copy `./backend/.env.exemple` to `./backend/.env` and fill it
    - In terminal:
    ````
    cd ./backend
    docker compose up --build
    ````
    - When is finished go to `http://localhost:8080` and you can connect on Adminer
    - Check in `geodb` if you have correctly tables `arrested_data` and `stations`
3. **For Frontend**
    - Copy `./frontend/.env.exemple` to `./frontend/.env` and fill it
    - In terminal:
    ````
    cd ./frontend
    npm install
    npm run dev
    ````
    - **You can go to `http:/localhost:3000` and check your app !** :tada: