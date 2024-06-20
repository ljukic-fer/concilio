import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../style';
import StarRating from './StarRating'
import Reviews from './Reviews';
import ManageFiles from './ManageFiles';

const Repository = ({ conference, onBackClick }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [approvedFiles, setApprovedFiles] = useState([]);
  const [showReviews, setShowReviews] = useState(null);

  const handleFileChange = (event) => {
    console.log('ID KONFERENCIJE: ', conference.conference_id)
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('conference_id', conference.conference_id);
      formData.append('email', localStorage.getItem('email'));
      formData.append('title', selectedFile.name);

      await axios.post('http://localhost:5000/api/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF.');
    }
  };


  const downloadPdf = async (fileId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/download-pdf/${fileId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.pdf`; // Set the default filename for the downloaded file
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const fetchApprovedFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/conference/${conference.conference_id}/approved-files`);
      setApprovedFiles(response.data);
    } catch (error) {
      console.error('Error fetching approved files:', error);
    }
  }

  const handleShowReviews = (fileId) => {
    setShowReviews(prev => (prev === fileId ? null : fileId));
  }


  useEffect(() => {
    fetchApprovedFiles();
    window.scrollTo(0, 0);
  }, [conference.conference_id])

  return (
    <div className={`${styles.marginY} ${styles.marginX}`}>
      <h1 className={`${styles.heading}`}>Repository</h1>
      <div className="flex mb-12">
        <div className="flex-col w-1/4">
          <button onClick={onBackClick} className="hover:cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-6 w-8 h-8 mt-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <p className='text-[12px] ml-6 mb-6'>Go back</p>
        </div>
        <div className='ml-auto items-center'>
          <h1 className={`${styles.heading} text-[20px]`}>Upload a file here</h1>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} className="mt-6 py-1 px-12 bg-blue-600 font-poppins font-medium text-primary outline-none rounded-[10px] mr-8 text-white hover:bg-blue-800">Upload PDF</button>
        </div>
      </div>
      <hr class="h-[1px] my-8 border-t-[1px] border-stone-500"></hr>

      {approvedFiles.length > 0 ? (
        <div className='mt-6'>
          <h2 className={styles.heading}>Approved Files</h2>
          <ul className={styles.paragraph}>
            {approvedFiles.map((file) => (
              <React.Fragment key={file.file_id}>
                <li
                  className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} hover:brightness-125 h-12 text-2xl sm:my-4 my-2 sm:flex flex-row bg-black-gradient-2 rounded-[20px] box-shadow w-full justify-between items-center`}
                  >
                  {file.title}
                  <div className="flex items-center ml-auto">
                    <p className='mr-12 hover:cursor-pointer' onClick={() => handleShowReviews(file.file_id)}>expand</p>
                    <StarRating fileId={file.file_id} />
                    <button className='ml-24' onClick={() => downloadPdf(file.file_id, file.title)}>Download</button>
                  </div>
                </li>
                {showReviews === file.file_id && <Reviews fileId={showReviews} />}
              </React.Fragment>
            ))}
          </ul>
        </div>) : (
        <h1 className='font-poppins font-bold text-[24px] mt-12'>No files in this repository</h1>
      )}

      {localStorage.getItem('email') === conference.coordinator && <ManageFiles conference={conference} fetchApprovedFiles={fetchApprovedFiles} />}

    </div>
  );
};

export default Repository;
