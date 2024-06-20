import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from '../style';

const ManageFiles = ({ conference, fetchApprovedFiles }) => {
    const [pendingFiles, setPendingFiles] = useState([]);

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

    const fetchPendingFiles = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/conference/${conference.conference_id}/pending-files`);
            setPendingFiles(response.data);
        } catch (error) {
            console.error('Error fetching approved files:', error);
        }
    }

    const handleApproval = async (fileId) => {
        const confirmApprove = window.confirm('Are you sure you want to approve this file?');
        if (confirmApprove) {
            try {
                const response = await axios.post(`http://localhost:5000/api/approve-file/${fileId}`);
                alert('File approved successfully!');
                fetchPendingFiles();
                fetchApprovedFiles();
            } catch (error) {
                console.error('Error approving file:', error);
                alert('Failed to approve file.');
            }
        }
    }


    useEffect(() => {
        fetchPendingFiles();
        window.scrollTo(0, 0);
    }, [conference.conference_id])

    return (
        <div className='mt-12'>
            <hr class="h-[1px] my-8 border-t-[1px] border-stone-500"></hr>
            {pendingFiles.length > 0 ? (
                <div>
                    <hr class="h-[1px] my-8"></hr>
                    <h2 className={styles.heading}>Files pending approval</h2>
                    <ul className={`${styles.paragraph}`}>
                        {pendingFiles.map((file) => (
                            <li key={file.file_id}
                                className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} h-12 text-2xl sm:my-4 my-2 sm:flex flex-row bg-black-gradient-2 hover:brightness-125 rounded-[20px] box-shadow w-full justify-between items-center`}>
                                {file.title}
                                <div className="flex items-center ml-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="#32ad26" className="w-12 h-12 mr-20 hover:stroke-green-800 hover:cursor-pointer"
                                        onClick={() => handleApproval(file.file_id)}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                    <button onClick={() => downloadPdf(file.file_id, file.title)}>Download</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>) : (
                    <h1 className='font-poppins font-bold text-[24px] mt-12'>No files in this repository</h1>
            )}
        </div>
    );
}

export default ManageFiles