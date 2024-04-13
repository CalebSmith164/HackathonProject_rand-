// Import the Supabase client
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://hutlkszqjimqkjbkchsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dGxrc3pxamltcWtqYmtjaHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMjk3NTI2NSwiZXhwIjoyMDI4NTUxMjY1fQ.F3Td4ApsS9FCLcvwYDHPI4DTsEtA9iTRQeIbJikBnWw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch data from the database
async function fetchData() {
    try {
        // Query the database using Supabase client
        const { data, error } = await supabase
            .from('Users')
            .select('*'); // You can specify columns you want to fetch instead of '*'

        if (error) {
            throw error;
        }

        // Log the fetched data
        console.log('Fetched data:', data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

async function insertNewRoutine(rouID, usID, machID)
{
	try {
		const {data, error} = await supabase
			.from('Routines')
			.insert([{routineID: rouID, userID: usID, machineUsed: [machID]}])
			.select();
			
		if(error)
		{
			throw error;
		}
	}
	catch (error)
	{
		console.error('Error inserting data:', error.message);
	}
}

async function insertNewUser(usID, initialWeight)
{
	 await supabase
			.from('Users')
			.insert([{userID: usID, currWeight: initialWeight}])
}


async function getMachAvailability(workOut)
{
	const [data1, data2] = await Promise.all([
	supabase
		.from('Machine')
		.select('*', {countTotal: 'exact'})
		.eq('muscleWorked', workOut), 
	supabase
		.from('Machine')
		.select('isEmpty', {count: 'exact'})
		.eq('muscleWorked', workOut)
		.eq('isEmpty', 'FALSE')
	]);
	
	const countTotal= data1.data.length; 
	const count = data2.data.length; 
	
	console.log('Total available machines for ' + workOut + ' is: ', count);
	console.log('Total percent availability: ', (count/countTotal)*100, '%'); 
};

async function getGymAvailability()
{
	const [data1, data2] = await Promise.all([
	supabase
		.from('Machine')
		.select('*', {countTotal: 'exact'}), 
	supabase
		.from('Machine')
		.select('isEmpty', {count: 'exact'})
		.eq('isEmpty', 'FALSE')
	]);
	
	const countTotal= data1.data.length; 
	const count = data2.data.length; 
	
	console.log('Total available machines is: ', count);
	console.log('Total percent availability: ', (count/countTotal)*100, '%'); 
};

async function updateColumn(tableName, columnToUpdate, conditionColumn, conditionValue)
{
    const {data} = await supabase
       .from(tableName)
       .select(columnToUpdate)
       .eq(conditionColumn, conditionValue)
       .single(); 

     const currentValue = data[columnToUpdate]; 
     const newValue = !currentValue; 

     console.log(currentValue);
     console.log(newValue);

     await supabase
         .from(tableName)
         .update({[columnToUpdate] : newValue})
         .eq(conditionColumn, conditionValue); 
}
// Call the fetchData function to fetch data from the database
//fetchData();
//getMachAvailability("cardio"); 
//getGymAvailability();
//updateColumn('Machine', 'isEmpty', 'urlLink', 'rand/13'); 
//insertNewUser(9, 210); 
