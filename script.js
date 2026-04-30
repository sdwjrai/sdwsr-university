// ============================================
// SDWSR UNIVERSITY - DATABASE CONNECTION
// REPLACE WITH YOUR SUPABASE KEYS!
// ============================================

// ⚠️ IMPORTANT: Get these from Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';  // ← CHANGE THIS
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';  // ← CHANGE THIS

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentCourses = [];
let currentFilter = 'all';

// ============================================
// HELPER FUNCTIONS (Moved to top)
// ============================================
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================
// PAGE LOAD INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadCourses();
    loadCourseSelect();
    setupFilterButtons();
    setupAdminTabs();
    
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', registerStudent);
    }
});

// ============================================
// HOMEPAGE STATS
// ============================================
async function loadStats() {
    try {
        const { count: studentCount, error: studentError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true });
        
        const { count: courseCount, error: courseError } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true });
        
        if (!studentError && document.getElementById('studentCount')) {
            document.getElementById('studentCount').textContent = studentCount || 0;
        }
        
        if (!courseError && document.getElementById('courseCount')) {
            document.getElementById('courseCount').textContent = courseCount || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================
// COURSES PAGE FUNCTIONS
// ============================================
async function loadCourses() {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('id');
        
        if (error) throw error;
        
        currentCourses = data || [];
        renderCourses();
    } catch (error) {
        console.error('Error loading courses:', error);
        const grid = document.getElementById('coursesGrid');
        if (grid) grid.innerHTML = '<div class="loading">Error loading courses. Please try again.</div>';
    }
}

function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    let filteredCourses = currentCourses;
    if (currentFilter !== 'all') {
        filteredCourses = currentCourses.filter(c => c.level === currentFilter);
    }
    
    if (filteredCourses.length === 0) {
        grid.innerHTML = '<div class="loading">No courses found.</div>';
        return;
    }
    
    grid.innerHTML = filteredCourses.map(course => `
        <div class="course-card">
            <div class="content">
                <h3>${escapeHtml(course.title)}</h3>
                <span class="course-level level-${course.level}">${course.level.toUpperCase()}</span>
                <p>${escapeHtml(course.description || 'No description available.')}</p>
                <p><strong>Duration:</strong> ${course.duration || 8} weeks</p>
                <p><strong>Instructor:</strong> ${escapeHtml(course.instructor || 'SDWSR Faculty')}</p>
                <button class="enroll-btn" onclick="openEnrollModal(${course.id}, '${escapeHtml(course.title)}')">Enroll Now →</button>
            </div>
        </div>
    `).join('');
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (buttons.length === 0) return;
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCourses();
        });
    });
}

// ============================================
// ENROLLMENT MODAL
// ============================================
let selectedCourseId = null;
let selectedCourseName = '';

function openEnrollModal(courseId, courseName) {
    selectedCourseId = courseId;
    selectedCourseName = courseName;
    
    const modal = document.getElementById('enrollModal');
    const courseNameSpan = document.getElementById('modalCourseName');
    
    if (courseNameSpan) courseNameSpan.textContent = `Course: ${courseName}`;
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('enrollModal');
    if (modal) modal.style.display = 'none';
    
    const nameInput = document.getElementById('studentName');
    const emailInput = document.getElementById('studentEmail');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
}

async function submitEnrollment() {
    const studentName = document.getElementById('studentName')?.value.trim();
    const studentEmail = document.getElementById('studentEmail')?.value.trim();
    
    if (!studentName || !studentEmail) {
        alert('Please enter both name and email!');
        return;
    }
    
    try {
        let { data: existingStudent, error: findError } = await supabase
            .from('students')
            .select('id')
            .eq('email', studentEmail)
            .maybeSingle();
        
        let studentId;
        
        if (!existingStudent) {
            const { data: newStudent, error: createError } = await supabase
                .from('students')
                .insert([{
                    name: studentName,
                    email: studentEmail,
                    registered_at: new Date()
                }])
                .select()
                .single();
            
            if (createError) throw createError;
            studentId = newStudent.id;
        } else {
            studentId = existingStudent.id;
        }
        
        const { error: enrollError } = await supabase
            .from('enrollments')
            .insert([{
                student_id: studentId,
                course_id: selectedCourseId,
                enrolled_at: new Date()
            }]);
        
        if (enrollError) throw enrollError;
        
        alert(`✅ Successfully enrolled in ${selectedCourseName}!`);
        closeModal();
        loadStats();
        
    } catch (error) {
        console.error('Enrollment error:', error);
        alert('Error enrolling. Please try again.');
    }
}

// ============================================
// REGISTRATION FORM
// ============================================
async function loadCourseSelect() {
    const select = document.getElementById('courseInterest');
    if (!select) return;
    
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('id, title');
        
        if (error) throw error;
        
        select.innerHTML = '<option value="">Select a course</option>' +
            data.map(c => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function registerStudent(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const dob = document.getElementById('dob')?.value;
    const country = document.getElementById('country')?.value;
    const courseInterest = document.getElementById('courseInterest')?.value;
    const referral = document.getElementById('referral')?.value;
    
    if (!fullName || !email) {
        alert('Please fill in all required fields!');
        return;
    }
    
    try {
        const { data: existing, error: checkError } = await supabase
            .from('students')
            .select('id')
            .eq('email', email)
            .maybeSingle();
        
        if (existing) {
            alert('This email is already registered!');
            return;
        }
        
        const { data: newStudent, error: insertError } = await supabase
            .from('students')
            .insert([{
                name: fullName,
                email: email,
                dob: dob || null,
                country: country,
                referral_source: referral,
                registered_at: new Date()
            }])
            .select()
            .single();
        
        if (insertError) throw insertError;
        
        if (courseInterest) {
            await supabase
                .from('enrollments')
                .insert([{
                    student_id: newStudent.id,
                    course_id: parseInt(courseInterest),
                    enrolled_at: new Date()
                }]);
        }
        
        const form = document.getElementById('registrationForm');
        const successMsg = document.getElementById('successMessage');
        if (form) form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
        
        loadStats();
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error during registration. Please try again.');
    }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================
function adminLogin() {
    const password = document.getElementById('adminPassword')?.value;
    
    if (password === 'sdwsr2025') {
        const loginSection = document.getElementById('loginSection');
        const adminPanel = document.getElementById('adminPanel');
        
        if (loginSection) loginSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        
        loadAdminData();
    } else {
        alert('Incorrect password!');
    }
}

function setupAdminTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = btn.getAttribute('data-tab');
            showTab(tabName, btn);
        });
    });
}

function showTab(tabName, activeBtn) {
    const tabs = ['students', 'courses', 'enrollments', 'addCourse'];
    tabs.forEach(tab => {
        const element = document.getElementById(`${tab}Tab`);
        if (element) element.style.display = 'none';
    });
    
    const selectedTab = document.getElementById(`${tabName}Tab`);
    if (selectedTab) selectedTab.style.display = 'block';
    
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    } else {
        const matchingBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }
}

async function loadAdminData() {
    await loadAllStudents();
    await loadAllCoursesAdmin();
    await loadAllEnrollments();
}

async function loadAllStudents() {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('registered_at', { ascending: false });
        
        if (error) throw error;
        
        const studentsList = document.getElementById('studentsList');
        if (!studentsList) return;
        
        if (!data || data.length === 0) {
            studentsList.innerHTML = '<div class="loading">No students registered yet.</div>';
            return;
        }
        
        studentsList.innerHTML = `
            <table>
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Registered</th><th>Action</th></tr>
                </thead>
                <tbody>
                    ${data.map(s => `
                        <tr>
                            <td>${s.id}</td>
                            <td>${escapeHtml(s.name)}</td>
                            <td>${escapeHtml(s.email)}</td>
                            <td>${new Date(s.registered_at).toLocaleDateString()}</td>
                            <td><button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading students:', error);
        const studentsList = document.getElementById('studentsList');
        if (studentsList) {
            studentsList.innerHTML = '<div class="loading">Error loading students.</div>';
        }
    }
}

async function loadAllCoursesAdmin() {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('id');
        
        if (error) throw error;
        
        const coursesList = document.getElementById('adminCoursesList');
        if (!coursesList) return;
        
        if (!data || data.length === 0) {
            coursesList.innerHTML = '<div class="loading">No courses available.</div>';
            return;
        }
        
        coursesList.innerHTML = `
            <table>
                <thead>
                    <tr><th>ID</th><th>Title</th><th>Level</th><th>Duration</th><th>Action</th></tr>
                </thead>
                <tbody>
                    ${data.map(c => `
                        <tr>
                            <td>${c.id}</td>
                            <td>${escapeHtml(c.title)}</td>
                            <td>${c.level}</td>
                            <td>${c.duration} weeks</td>
                            <td><button class="delete-btn" onclick="deleteCourse(${c.id})">Delete</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadAllEnrollments() {
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                students (name, email),
                courses (title)
            `)
            .order('enrolled_at', { ascending: false });
        
        if (error) throw error;
        
        const enrollmentsList = document.getElementById('enrollmentsList');
        if (!enrollmentsList) return;
        
        if (!data || data.length === 0) {
            enrollmentsList.innerHTML = '<div class="loading">No enrollments yet.</div>';
            return;
        }
        
        enrollmentsList.innerHTML = `
            <table>
                <thead>
                    <tr><th>Student</th><th>Course</th><th>Enrolled Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                    ${data.map(e => `
                        <tr>
                            <td>${escapeHtml(e.students?.name || 'Unknown')}<br><small>${escapeHtml(e.students?.email || '')}</small></td>
                            <td>${escapeHtml(e.courses?.title || 'Unknown')}</td>
                            <td>${new Date(e.enrolled_at).toLocaleDateString()}</td>
                            <td><button class="delete-btn" onclick="deleteEnrollment(${e.id})">Delete</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading enrollments:', error);
    }
}

async function addNewCourse() {
    const title = document.getElementById('newCourseTitle')?.value.trim();
    const description = document.getElementById('newCourseDesc')?.value.trim();
    const level = document.getElementById('newCourseLevel')?.value;
    let duration = parseInt(document.getElementById('newCourseDuration')?.value);
    const instructor = document.getElementById('newCourseInstructor')?.value.trim();
    
    if (!title) {
        alert('Please enter a course title!');
        return;
    }
    
    if (isNaN(duration) || duration < 1) {
        duration = 8;
    }
    
    try {
        const { error } = await supabase
            .from('courses')
            .insert([{
                title: title,
                description: description,
                level: level,
                duration: duration,
                instructor: instructor || 'SDWSR Faculty'
            }]);
        
        if (error) throw error;
        
        alert('Course added successfully!');
        
        const titleInput = document.getElementById('newCourseTitle');
        const descInput = document.getElementById('newCourseDesc');
        const durationInput = document.getElementById('newCourseDuration');
        
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
        if (durationInput) durationInput.value = '8';
        
        loadCourses();
        loadAllCoursesAdmin();
        loadStats();
        
    } catch (error) {
        console.error('Error adding course:', error);
        alert('Error adding course. Please try again.');
    }
}

async function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await supabase.from('enrollments').delete().eq('student_id', studentId);
            await supabase.from('students').delete().eq('id', studentId);
            loadAdminData();
            loadStats();
            alert('Student deleted successfully!');
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Error deleting student.');
        }
    }
}

async function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            await supabase.from('enrollments').delete().eq('course_id', courseId);
            await supabase.from('courses').delete().eq('id', courseId);
            loadAdminData();
            loadCourses();
            loadStats();
            alert('Course deleted successfully!');
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Error deleting course.');
        }
    }
}

async function deleteEnrollment(enrollmentId) {
    if (confirm('Are you sure you want to remove this enrollment?')) {
        try {
            await supabase.from('enrollments').delete().eq('id', enrollmentId);
            loadAllEnrollments();
            alert('Enrollment removed successfully!');
        } catch (error) {
            console.error('Error deleting enrollment:', error);
            alert('Error deleting enrollment.');
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('enrollModal');
    if (event.target === modal) {
        closeModal();
    }
}