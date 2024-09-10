import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCard } from '../../../../../../../redux/reducers/cardSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import { FaTimes } from 'react-icons/fa';


const EditCard = ({ card, closeEdit, members }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [attachments, setAttachments] = useState([]); // Added attachments state
    const [comments, setComments] = useState([]); // Added comments state
    const [cover, setCover] = useState(''); // Added cover state
    const [showMemberPanel, setShowMemberPanel] = useState(false);
    const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    let cardId;

    if (card) {
        cardId = card._id;
    }

    useEffect(() => {
        if (card) {
            setTitle(card.title || '');
            setDescription(card.description || '');
            setChecklist(card.checklist || []);
            setStartDate(card.startDate ? new Date(card.startDate) : null);
            setDueDate(card.dueDate ? new Date(card.dueDate) : null);
            setSelectedMembers(card.memberIds || []);
            setAttachments(card.attachments || []); // Initialize attachments
            setComments(card.comments || []); // Initialize comments
            setCover(card.cover || ''); // Initialize cover

        }
    }, [card]);

    const addChecklistItem = () => {
        setChecklist([...checklist, { text: '', completed: false }]);
    };

    const updateChecklistItem = (index, newItem) => {
        const updatedChecklist = [...checklist];
        updatedChecklist[index] = newItem;
        setChecklist(updatedChecklist);
    };

    const removeChecklistItem = (index) => {
        const updatedChecklist = checklist.filter((_, i) => i !== index);
        setChecklist(updatedChecklist);
    };

    const getCompletionPercentage = () => {
        const totalItems = checklist.length;
        const completedItems = checklist.filter((item) => item.completed).length;
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };




    const handleSave = async () => {
        // Initialize the updatedCard object and only add non-empty fields
        const updatedCard = {};


        if (title ) {
            updatedCard.title = title.trim();

            updatedCard.description = DOMPurify.sanitize(description.trim());
    
            updatedCard.checklist = checklist;
            updatedCard.startDate = startDate;
            updatedCard.dueDate = dueDate;
            updatedCard.memberIds = selectedMembers;
            updatedCard.attachments = attachments; // Add attachments
            updatedCard.comments = comments; // Add comments
            updatedCard.cover = cover.trim(); // Add cover
            
        }else {
            return toast.error("Title is required", {position: "top-right"})
        }

       

        // Proceed only if there is at least one field to update
        if (Object.keys(updatedCard).length > 0) {
            try {
                await dispatch(updateCard({ cardId, updatedCard })).unwrap();

                // Set reminder if a due date is present
                if (dueDate) {
                    await fetch(`/cards/${cardId}/setReminder`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dueDate }),
                    });
                }

                toast.success('Card updated successfully!', { autoClose: 3000 });
                closeEdit();
            } catch (error) {
                toast.error('Failed to update card.', { autoClose: 3000 });
            }
        } else {
            toast.error('No changes to update!', { autoClose: 3000 });
        }
    };

    useEffect(() => {
        if (dueDate) {
            const now = new Date();
            if (dueDate < now) {
                toast.error('Due date has passed!', { autoClose: 5000 });
            } else if (dueDate - now < 24 * 60 * 60 * 1000) {
                toast.warn('Due date is in less than 24 hours!', { autoClose: 5000 });
            }
        }
    }, [dueDate]);

    const filteredMembers = members.filter(member =>
        member.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMemberSelect = (memberId) => {
        if (!selectedMembers.includes(memberId)) {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const handleMemberDeselect = (memberId) => {
        setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-lg relative max-h-[90vh] overflow-auto">
                <h2 className="text-2xl font-semibold mb-4">{card.title}</h2>
                <button
                    onClick={closeEdit}
                    className="absolute top-3 right-3 text-blue-500 text-lg hover:text-gray-700"
                >
                    <FaTimes />
                </button>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1 outline-none">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Description</label>
                    {description && <div
                        dangerouslySetInnerHTML={{ __html: description }}
                        className="p-2 border rounded-md text-sm"
                    />}


                    {!description ? (<button
                        onClick={() => setShowDescriptionEditor(true)}
                        className="text-sm py-3 text-blue-500 hover:underline"
                    >
                        Add Description
                    </button>) : (<div className=' w-[50%] flex mt-3 justify-between items-center flex-row'>
                        <button
                            onClick={() => setShowDescriptionEditor(true)}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Edit Description
                        </button>
                    </div>)}

                    {showDescriptionEditor && (
                        <div className="mt-2">
                            <Editor
                                apiKey={import.meta.env.VITE_TINY_API_KEY}
                                value={description}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                    ],
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                    tinycomments_mode: 'embedded',
                                    tinycomments_author: 'Author name',
                                    mergetags_list: [
                                        { value: 'First.Name', title: 'First Name' },
                                        { value: 'Email', title: 'Email' },
                                    ],
                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                }}
                                onEditorChange={(newValue) => setDescription(newValue)}
                            />

                            {
                                showDescriptionEditor && <div className=' flex justify-end items-center flex-row'>
                                    <button
                                        onClick={() => setShowDescriptionEditor(false)}
                                        className="bg-gray-300 text-gray-700 mt-3 px-2 py-1 text-sm rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            }

                        </div>
                    )}
                </div>

                {/* Checklist */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Checklist</label>

                    {/* Progress Bar */}
                    {checklist.length > 0 && (
                        <div className="mb-2">
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center">
                                    <div className="flex-1 mr-2">
                                        <div className="relative flex items-center justify-between text-xs">
                                            <span>{getCompletionPercentage()}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex h-2 overflow-hidden text-xs flex-col justify-center bg-gray-200 rounded">
                                        <div
                                            style={{ width: `${getCompletionPercentage()}%` }}
                                            className="flex-col h-full text-center text-white bg-blue-500 shadow-md rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {checklist.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => updateChecklistItem(index, { ...item, completed: !item.completed })}
                                className="mr-2"
                            />
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updateChecklistItem(index, { ...item, text: e.target.value })}
                                className="w-full px-2 py-1 border rounded-md"
                            />
                            <button
                                onClick={() => removeChecklistItem(index)}
                                className="ml-2 text-red-500 text-sm hover:underline"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addChecklistItem}
                        className="text-blue-500 text-sm hover:underline"
                    >
                        Add Item
                    </button>
                </div>


                {/* Start and Due Dates */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Start Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="w-full p-2 border rounded-md text-sm"
                        dateFormat="MM/dd/yyyy"
                        placeholderText='mm/dd/yyyy'
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Due Date</label>
                    <DatePicker
                        selected={dueDate}
                        onChange={(date) => setDueDate(date)}
                        className="w-full p-2 border rounded-md text-sm"
                        dateFormat="MM/dd/yyyy"
                        placeholderText='mm/dd/yyyy'
                    />
                </div>

                {/* Members */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Members</label>
                    <button
                        onClick={() => setShowMemberPanel(!showMemberPanel)}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        {showMemberPanel ? 'Hide Members' : 'Show Members'}
                    </button>
                    {showMemberPanel && (
                        <div className="mt-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded-md mb-2"
                                placeholder="Search Members"
                            />
                            {filteredMembers.map((member) => (
                                <div key={member._id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member._id)}
                                        onChange={() => handleMemberSelect(member._id)}
                                        className="mr-2"
                                    />
                                    <span>{member.fullname}</span>
                                </div>
                            ))}
                            {selectedMembers.map((memberId) => {
                                const member = members.find(m => m._id === memberId);
                                return member ? (
                                    <div key={memberId} className="flex items-center mb-2">
                                        <button
                                            onClick={() => handleMemberDeselect(memberId)}
                                            className="text-red-500 hover:underline mr-2"
                                        >
                                            &times;
                                        </button>
                                        <span>{member.fullname}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                </div>

                {/* Attachments */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Attachments</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setAttachments([...attachments, ...Array.from(e.target.files)])}
                        className="w-full p-2 border rounded-md text-sm"
                    />
                    <ul>
                        {attachments.map((file, index) => (
                            <li key={index} className="mb-2">{file.name}</li>
                        ))}
                    </ul>
                </div>

                {/* Comments */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Comments</label>
                    <textarea
                        value={comments.join('\n')}
                        onChange={(e) => setComments(e.target.value.split('\n'))}
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Add comments"
                    />
                </div>

                {/* Cover */}
                <div className="mb-4">
                    <label className="block text-base font-medium mb-1">Cover</label>
                    <input
                        type="text"
                        value={cover}
                        onChange={(e) => setCover(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Cover URL"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={closeEdit}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCard;
