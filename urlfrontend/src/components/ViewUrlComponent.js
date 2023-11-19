// import React, { useEffect, useState } from 'react'
// import axios from "axios"

// const ViewUrlComponent= () => {
//     const [urls, setUrls] = useState([]);

//     useEffect(() => {
//       const fetchUrlAndSetUrl = async () => {
//         const result = await axios.get("http://localhost:3333/all");
//         setUrls(result.data);
//       };
//       fetchUrlAndSetUrl();
//     }, [urls]);

//   return (
//     <div>
//       <table className="table">
//         <thead className="table-dark">
//           <tr>
//             <th>Original Url</th>
//             <th>Short Url</th>
//             <th>Click Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {urls.map((url, idx) => (
//             <tr key={idx}>
//               <td>{url.origUrl}</td>
//               <td>
//                 <a href={`${url.shortUrl}`}>{url.shortUrl}</a>
//               </td>
//               <td>{url.clicks}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ViewUrlComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const ViewUrlComponent = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchUrlAndSetUrl = async () => {
      try {
        const result = await axios.get('http://localhost:3333/all');
        setUrls(result.data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchUrlAndSetUrl();
  }, []);

  return (
    <div>
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th>Original Url</th>
            <th>Short Url</th>
            <th>Click Count</th>
            <th>QR Code</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url, idx) => (
            <tr key={idx}>
              <td>{url.origUrl}</td>
              <td>
                <a href={`${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
                  {url.shortUrl}
                </a>
              </td>
              <td>{url.clicks}</td>
              <td>
                <QRCode value={url.shortUrl} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUrlComponent;
