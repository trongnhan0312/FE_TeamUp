import React, { memo, useState } from 'react';
import {
    FaCalendar,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaTag,
    FaCheck,
    FaTimes,
    FaStar,
    FaStarHalfAlt,
    FaRegStar
} from 'react-icons/fa';
import './RoomDetail.scss';

const RoomDetail = () => {
    // Mock data
    const [roomData] = useState({
        id: 1,
        name: "Sân cầu lông HAT",
        date: "04/03/2025",
        time: "18:30",
        duration: "1 tiếng",
        location: "Sân cầu lông HAT",
        address: "269 Nguyễn Thái Sơn Gò Vấp",
        skill: "Trình độ cơ bản",
        fee: "38.000VND",
        hostName: "Nguyễn Văn A",
        hostAvatar: "/api/placeholder/40/40",
        maxPlayers: 8,
        currentPlayers: 4
    });

    const [waitingList, setWaitingList] = useState([
        {
            id: 1,
            name: "Trần Văn B",
            avatar: "/api/placeholder/40/40",
            joinTime: "19:30",
            skill: "Trung bình"
        },
        {
            id: 2,
            name: "Lê Thị C",
            avatar: "/api/placeholder/40/40",
            joinTime: "19:25",
            skill: "Cơ bản"
        },
        {
            id: 3,
            name: "Phạm Văn D",
            avatar: "/api/placeholder/40/40",
            joinTime: "19:20",
            skill: "Khá"
        }
    ]);

    const [joinedPlayers, setJoinedPlayers] = useState([
        {
            id: 1,
            name: "Nguyễn Văn A",
            avatar: "/api/placeholder/40/40",
            skill: "Trung bình",
            isHost: true
        },
        {
            id: 2,
            name: "Hoàng Thị E",
            avatar: "/api/placeholder/40/40",
            skill: "Cơ bản",
            isHost: false
        },
        {
            id: 3,
            name: "Đặng Văn F",
            avatar: "/api/placeholder/40/40",
            skill: "Khá",
            isHost: false
        },
        {
            id: 4,
            name: "Võ Thị G",
            avatar: "/api/placeholder/40/40",
            skill: "Trung bình",
            isHost: false
        }
    ]);

    const [ratings, setRatings] = useState({
        players: {},
        coach: 0
    });

    const handleAcceptPlayer = (playerId) => {
        const player = waitingList.find(p => p.id === playerId);
        if (player && joinedPlayers.length < roomData.maxPlayers) {
            setJoinedPlayers(prev => [...prev, { ...player, isHost: false }]);
            setWaitingList(prev => prev.filter(p => p.id !== playerId));
        }
    };

    const handleRejectPlayer = (playerId) => {
        setWaitingList(prev => prev.filter(p => p.id !== playerId));
    };

    const handlePlayerRating = (playerId, rating) => {
        setRatings(prev => ({
            ...prev,
            players: {
                ...prev.players,
                [playerId]: rating
            }
        }));
    };

    const handleCoachRating = (rating) => {
        setRatings(prev => ({
            ...prev,
            coach: rating
        }));
    };

    const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
        const [hoverRating, setHoverRating] = useState(0);

        const renderStar = (index) => {
            const starValue = index + 1;
            const currentRating = hoverRating || rating;

            if (currentRating >= starValue) {
                return <FaStar className="star filled" />;
            } else if (currentRating >= starValue - 0.5) {
                return <FaStarHalfAlt className="star half-filled" />;
            } else {
                return <FaRegStar className="star empty" />;
            }
        };

        return (
            <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        className={`star-wrapper ${readOnly ? 'readonly' : ''}`}
                        onClick={() => !readOnly && onRatingChange && onRatingChange(index + 1)}
                        onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
                        onMouseLeave={() => !readOnly && setHoverRating(0)}
                    >
                        {renderStar(index)}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="room-detail">
            <div className="room-detail-container">
                {/* Main Room Info */}
                <div className="room-info-card">
                    <div className="room-info-content">
                        <div className="info-row">
                            <FaCalendar className="info-icon" />
                            <span className="info-label">Chọn ngày và giờ</span>
                            <span className="info-value">{roomData.date} lúc {roomData.time}</span>
                        </div>

                        <div className="info-row">
                            <FaClock className="info-icon" />
                            <span className="info-label">Chọn thời gian</span>
                            <span className="info-value">{roomData.duration}</span>
                        </div>

                        <div className="info-row">
                            <FaMapMarkerAlt className="info-icon" />
                            <span className="info-label">Địa điểm</span>
                            <div className="location-info">
                                <div className="location-name">{roomData.location}</div>
                                <div className="location-address">{roomData.address}</div>
                            </div>
                        </div>

                        <div className="info-row">
                            <FaUsers className="info-icon" />
                            <span className="info-label">Trình độ</span>
                            <span className="info-value">{roomData.skill}</span>
                        </div>

                        <div className="info-row">
                            <FaTag className="info-icon" />
                            <span className="info-label">Mỗi người</span>
                            <span className="info-value">{roomData.fee}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="room-sidebar">
                    {/* Court Image and Join Button */}
                    <div className="court-section">
                        <div className="court-image">
                            <img src="/api/placeholder/200/120" alt="Sân cầu lông" />
                            <div className="court-name">Sân cầu lông</div>
                            <div className="court-rating">
                                <StarRating rating={4.5} readOnly />
                                <span className="rating-text">4.5/5 (24 reviews)</span>
                            </div>
                        </div>
                        <button className="join-button">
                            Tham gia
                        </button>
                    </div>

                    {/* Waiting List Table */}
                    <div className="waiting-section">
                        <h3>Hàng chờ ({waitingList.length})</h3>
                        {waitingList.length > 0 ? (
                            <div className="waiting-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Người chơi</th>
                                            <th>Trình độ</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitingList.map(player => (
                                            <tr key={player.id}>
                                                <td>
                                                    <div className="player-info">
                                                        <img src={player.avatar} alt={player.name} className="player-avatar" />
                                                        <span className="player-name">{player.name}</span>
                                                    </div>
                                                </td>
                                                <td>{player.skill}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="accept-btn"
                                                            onClick={() => handleAcceptPlayer(player.id)}
                                                            disabled={joinedPlayers.length >= roomData.maxPlayers}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            className="reject-btn"
                                                            onClick={() => handleRejectPlayer(player.id)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-waiting">Không có người chờ</div>
                        )}
                    </div>

                    {/* Joined Players List */}
                    <div className="players-section">
                        <h3>Người chơi đã tham gia ({joinedPlayers.length}/{roomData.maxPlayers})</h3>
                        <div className="players-list">
                            {joinedPlayers.map(player => (
                                <div key={player.id} className="player-card">
                                    <div className="player-info">
                                        <img src={player.avatar} alt={player.name} className="player-avatar" />
                                        <div className="player-details">
                                            <span className="player-name">
                                                {player.name}
                                                {player.isHost && <span className="host-badge">Host</span>}
                                            </span>
                                            <span className="player-skill">{player.skill}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="rating-section">
                        <h3>Đánh giá</h3>

                        {/* Coach Rating */}
                        <div className="rating-group">
                            <h4>Đánh giá HLV</h4>
                            <div className="rating-item">
                                <div className="rating-info">
                                    <img src="/api/placeholder/40/40" alt="Coach" className="rating-avatar" />
                                    <span className="rating-name">HLV Nguyễn Văn X</span>
                                </div>
                                <StarRating
                                    rating={ratings.coach}
                                    onRatingChange={handleCoachRating}
                                />
                            </div>
                        </div>

                        {/* Players Rating */}
                        <div className="rating-group">
                            <h4>Đánh giá người chơi</h4>
                            {joinedPlayers.filter(p => !p.isHost).map(player => (
                                <div key={player.id} className="rating-item">
                                    <div className="rating-info">
                                        <img src={player.avatar} alt={player.name} className="rating-avatar" />
                                        <span className="rating-name">{player.name}</span>
                                    </div>
                                    <StarRating
                                        rating={ratings.players[player.id] || 0}
                                        onRatingChange={(rating) => handlePlayerRating(player.id, rating)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(RoomDetail);