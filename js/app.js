// Dữ liệu mapping phường xã
let wardMappingsData = [];
let searchOptions = [];
let selectedMapping = null;
let lastSelectedText = '';

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function() {
    loadWardMappings();
    setupEventListeners();
});

// Thiết lập các event listeners
function setupEventListeners() {
    const form = document.getElementById('addressForm');
    const searchWardInput = document.getElementById('searchWardInput');
    const suggestionsDiv = document.getElementById('autocompleteSuggestions');
    const inputAddress = document.getElementById('inputAddress');

    form.addEventListener('submit', handleFormSubmit);
    
    // Autocomplete instant search
    searchWardInput.addEventListener('input', function(e) {
        showSuggestions(this.value);
        selectedMapping = null;
        lastSelectedText = '';
    });
    searchWardInput.addEventListener('focus', function(e) {
        if (this.value.trim().length > 0) showSuggestions(this.value);
    });
    searchWardInput.addEventListener('blur', function(e) {
        setTimeout(() => { suggestionsDiv.style.display = 'none'; }, 200);
    });

    // Xử lý chọn suggestion bằng phím
    searchWardInput.addEventListener('keydown', function(e) {
        const items = suggestionsDiv.querySelectorAll('.autocomplete-suggestion');
        let active = suggestionsDiv.querySelector('.autocomplete-suggestion.active');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!active) {
                if (items.length) items[0].classList.add('active');
            } else {
                active.classList.remove('active');
                if (active.nextElementSibling) active.nextElementSibling.classList.add('active');
                else items[0].classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!active) {
                if (items.length) items[items.length-1].classList.add('active');
            } else {
                active.classList.remove('active');
                if (active.previousElementSibling) active.previousElementSibling.classList.add('active');
                else items[items.length-1].classList.add('active');
            }
        } else if (e.key === 'Enter') {
            if (active) {
                e.preventDefault();
                active.click();
            }
        }
    });

    // Đã loại bỏ tự động focus từ input trên sang input dưới
}

// Load dữ liệu mapping từ file JSON
async function loadWardMappings() {
    try {
        const response = await fetch('json/ward_mappings.json');
        wardMappingsData = await response.json();
        
        // Tạo danh sách tìm kiếm
        createSearchOptions();
        
        console.log(`Đã tải ${wardMappingsData.length} bản ghi mapping`);
        
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu mapping:', error);
        showError('Không thể tải dữ liệu mapping. Vui lòng thử lại sau.');
    }
}

// Tạo danh sách tìm kiếm
function createSearchOptions() {
    searchOptions = wardMappingsData.map(item => ({
        value: item.old_ward_code,
        text: `${item.old_ward_name}, ${item.old_district_name}, ${item.old_province_name}`,
        data: item
    }));
}

function showSuggestions(searchTerm) {
    const suggestionsDiv = document.getElementById('autocompleteSuggestions');
    const input = document.getElementById('searchWardInput');
    suggestionsDiv.innerHTML = '';
    if (!searchTerm || searchTerm.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    // Tách từ khóa tìm kiếm
    const keywords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    // Tìm kiếm thông minh
    const filtered = searchOptions.filter(option => {
        const text = option.text.toLowerCase();
        
        // Nếu chỉ có 1 từ khóa, tìm kiếm bình thường
        if (keywords.length === 1) {
            return text.includes(keywords[0]);
        }
        
        // Nếu có nhiều từ khóa, kiểm tra xem có bao nhiêu từ khớp
        let matchCount = 0;
        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                matchCount++;
            }
        });
        
        // Trả về true nếu có ít nhất 1 từ khớp
        return matchCount > 0;
    });
    
    // Sắp xếp kết quả theo độ ưu tiên
    const sortedResults = filtered.sort((a, b) => {
        const textA = a.text.toLowerCase();
        const textB = b.text.toLowerCase();
        
        // Đếm số từ khóa khớp
        let matchCountA = 0;
        let matchCountB = 0;
        
        keywords.forEach(keyword => {
            if (textA.includes(keyword)) matchCountA++;
            if (textB.includes(keyword)) matchCountB++;
        });
        
        // Ưu tiên kết quả có nhiều từ khớp hơn
        if (matchCountA !== matchCountB) {
            return matchCountB - matchCountA;
        }
        
        // Nếu số từ khớp bằng nhau, ưu tiên kết quả bắt đầu với từ khóa
        const startsWithA = keywords.some(keyword => textA.startsWith(keyword));
        const startsWithB = keywords.some(keyword => textB.startsWith(keyword));
        
        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        
        // Cuối cùng, sắp xếp theo thứ tự alphabet
        return textA.localeCompare(textB);
    });
    
    if (sortedResults.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    sortedResults.slice(0, 20).forEach(option => {
        const div = document.createElement('div');
        div.className = 'autocomplete-suggestion';
        div.textContent = option.text;
        div.tabIndex = 0;
        div.onclick = function() {
            input.value = option.text;
            selectedMapping = option.data;
            lastSelectedText = option.text;
            suggestionsDiv.style.display = 'none';
        };
        div.onmousedown = function(e) { e.preventDefault(); };
        suggestionsDiv.appendChild(div);
    });
    
    if (sortedResults.length > 20) {
        const more = document.createElement('div');
        more.className = 'autocomplete-suggestion';
        more.style.color = '#888';
        more.textContent = `... và ${sortedResults.length - 20} kết quả khác. Vui lòng nhập cụ thể hơn.`;
        more.tabIndex = -1;
        suggestionsDiv.appendChild(more);
    }
    
    suggestionsDiv.style.display = 'block';
}

// Xử lý submit form
function handleFormSubmit(event) {
    event.preventDefault();
    
    const inputAddress = document.getElementById('inputAddress').value.trim();
    const searchWardInput = document.getElementById('searchWardInput');
    if (!inputAddress) {
        showError('Vui lòng nhập địa chỉ chi tiết.');
        return;
    }
    if (!searchWardInput.value || !selectedMapping || searchWardInput.value !== lastSelectedText) {
        showError('Vui lòng chọn phường/xã, quận/huyện, tỉnh/thành từ gợi ý.');
        return;
    }
    
    // Tạo địa chỉ mới
    const newAddress = createNewAddress(inputAddress, selectedMapping);
    
    // Hiển thị kết quả
    document.getElementById('outputAddress').value = newAddress;
    
    // Scroll đến kết quả
    document.getElementById('outputAddress').scrollIntoView({ behavior: 'smooth' });
    
    // Ẩn lỗi nếu có
    document.getElementById('errorSection').style.display = 'none';
}

// Tạo địa chỉ mới
function createNewAddress(inputAddress, mappingData) {
    // Tạo địa chỉ mới theo format: [Địa chỉ chi tiết], [Phường/Xã mới], [Tỉnh/Thành mới]
    let newAddress = inputAddress;
    
    if (mappingData.new_ward_name && mappingData.new_ward_name !== 'null') {
        newAddress += `, ${mappingData.new_ward_name}`;
    }
    
    if (mappingData.new_province_name && mappingData.new_province_name !== 'null') {
        newAddress += `, ${mappingData.new_province_name}`;
    }
    
    return newAddress;
}

// Hiển thị lỗi
function showError(message) {
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    
    // Scroll đến lỗi
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Copy địa chỉ mới vào clipboard
function copyToClipboard() {
    const outputAddress = document.getElementById('outputAddress');
    const address = outputAddress.value;
    
    if (!address) {
        showError('Không có địa chỉ để sao chép.');
        return;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
            showToast('Đã sao chép địa chỉ mới vào clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(address);
        });
    } else {
        fallbackCopyTextToClipboard(address);
    }
}

// Fallback cho việc copy text
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Đã sao chép địa chỉ mới vào clipboard!', 'success');
    } catch (err) {
        showToast('Không thể sao chép vào clipboard.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Hiển thị toast message
function showToast(message, type = 'info') {
    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
} 